"""
Module Name: db_insertor.py

Description:
    The methods for inserting the given records into the
    database

Author:
    Raphael Senellart

Date Created:
    April 6, 2025

Version:
    1.0.0

Usage:


Dependencies:


Notes:
    This tool is specialized for the zimbra agenda
    website, but some methods are generic and can be implemented
    else where.

"""

import logging
from itertools import islice

from django.db import transaction

from core.models import (
    InsaClass,
    Title,
    Teacher,
    Room,
    Department,
    GroupTD,
    ClassLinkTeacher,
    ClassLinkRoom,
    ClassLinkDepart,
    ClassLinkTD,
)

logger = logging.getLogger(__name__)


# small helper for chunking iterables
def chunked(iterable, size):
    it = iter(iterable)
    while True:
        chunk = list(islice(it, size))
        if not chunk:
            break
        yield chunk


def ensure_name_instances(model, names):
    """
    Ensure rows exist in `model` for every name in `names`.
    Returns dict: name -> instance
    Uses bulk_create for missing names.
    """
    names = {n for n in names if n}  # remove empty/None
    if not names:
        return {}

    existing_qs = model.objects.filter(name__in=names)
    existing = {obj.name: obj for obj in existing_qs}
    missing = names - set(existing.keys())

    # bulk create missing
    if missing:
        model_objs = [model(name=name) for name in missing]
        model.objects.bulk_create(model_objs, batch_size=500)
        # re-query the newly created ones
        for obj in model.objects.filter(name__in=missing):
            existing[obj.name] = obj

    return existing


def insert_list_record(list_of_records, batch_size=500):
    """
    Optimized bulk insert/update of InsaClass records and their link tables.

    Behavior:
    - Deletes InsaClass rows whose uid is not present in list_of_records.
    - Inserts new InsaClass rows in bulk.
    - Updates existing InsaClass rows only when sequence changed (bulk_update).
    - Replaces link rows (ClassLink*) for changed/created classes using bulk operations.

    Parameters:
      list_of_records: list[dict] (same structure as your original)
      batch_size: chunk size for batch DB operations
    """
    if not list_of_records:
        logger.info("No records to insert.")
        return

    # Step 0: prepare data structures
    records_by_uid = {rec["uid"]: rec for rec in list_of_records}
    new_uids = set(records_by_uid.keys())

    # Collect all related names across records (for bulk ensure)
    all_titles = {rec.get("desc") for rec in list_of_records if rec.get("desc")}
    all_teacher_names = {
        name for rec in list_of_records for name in rec.get("teachers", [])
    }
    all_room_names = {
        name for rec in list_of_records for name in rec.get("locations", [])
    }
    all_depart_names = {
        name for rec in list_of_records for name in rec.get("departments", [])
    }
    all_td_names = {name for rec in list_of_records for name in rec.get("td_tags", [])}

    with transaction.atomic():
        to_delete = InsaClass.objects.exclude(uid__in=new_uids)
        nb_deleted = len(to_delete)
        to_delete.delete()

        existing_qs = InsaClass.objects.filter(uid__in=new_uids).select_related("desc")
        existing_map = {obj.uid: obj for obj in existing_qs}

        title_map = ensure_name_instances(Title, all_titles)
        teacher_map = ensure_name_instances(Teacher, all_teacher_names)
        room_map = ensure_name_instances(Room, all_room_names)
        depart_map = ensure_name_instances(Department, all_depart_names)
        td_map = ensure_name_instances(GroupTD, all_td_names)

        to_create = []
        to_update = []
        classes_to_refresh_uids = []
        for uid, rec in records_by_uid.items():
            if uid not in existing_map:
                desc_obj = title_map.get(rec.get("desc"))
                inst = InsaClass(
                    uid=rec["uid"],
                    time_stamp=rec["time_stamp"],
                    start_hour=rec["time_start"],
                    end_hour=rec["time_end"],
                    date=rec["date"],
                    desc=desc_obj,
                    time_created=rec.get("time_created"),
                    time_last_modified=rec.get("time_last_modified"),
                    sequence=rec.get("sequence"),
                )
                to_create.append(inst)
                classes_to_refresh_uids.append(uid)
            else:
                existing = existing_map[uid]
                if existing.sequence != rec.get("sequence"):
                    existing.time_stamp = rec["time_stamp"]
                    existing.start_hour = rec["time_start"]
                    existing.end_hour = rec["time_end"]
                    existing.date = rec["date"]
                    existing.desc = title_map.get(rec.get("desc"))
                    existing.time_created = rec.get("time_created")
                    existing.time_last_modified = rec.get("time_last_modified")
                    existing.sequence = rec.get("sequence")
                    to_update.append(existing)
                    classes_to_refresh_uids.append(uid)

        created_map = {}
        if to_create:
            InsaClass.objects.bulk_create(to_create, batch_size=batch_size)
            created_uids = [inst.uid for inst in to_create]
            for obj in InsaClass.objects.filter(uid__in=created_uids):
                created_map[obj.uid] = obj

        if to_update:
            InsaClass.objects.bulk_update(
                to_update,
                fields=[
                    "time_stamp",
                    "start_hour",
                    "end_hour",
                    "date",
                    "desc",
                    "time_created",
                    "time_last_modified",
                    "sequence",
                ],
                batch_size=batch_size,
            )

        class_map = {}
        if existing_map:
            for obj in InsaClass.objects.filter(uid__in=list(existing_map.keys())):
                class_map[obj.uid] = obj
        class_map.update(created_map)

        if classes_to_refresh_uids:
            ClassLinkTeacher.objects.filter(
                insa_class__uid__in=classes_to_refresh_uids
            ).delete()
            ClassLinkRoom.objects.filter(
                insa_class__uid__in=classes_to_refresh_uids
            ).delete()
            ClassLinkDepart.objects.filter(
                insa_class__uid__in=classes_to_refresh_uids
            ).delete()
            ClassLinkTD.objects.filter(
                insa_class__uid__in=classes_to_refresh_uids
            ).delete()

            teacher_links = []
            room_links = []
            depart_links = []
            td_links = []

            for uid in classes_to_refresh_uids:
                insa_cls = class_map.get(uid)
                if not insa_cls:
                    continue
                rec = records_by_uid[uid]

                tnames = set(rec.get("teachers", []))
                rnames = set(rec.get("locations", []))
                dnames = set(rec.get("departments", []))
                tdtags = set(rec.get("td_tags", []))

                for t in tnames:
                    teacher = teacher_map.get(t)
                    if teacher:
                        teacher_links.append(
                            ClassLinkTeacher(insa_class=insa_cls, teacher=teacher)
                        )

                for r in rnames:
                    room = room_map.get(r)
                    if room:
                        room_links.append(ClassLinkRoom(insa_class=insa_cls, room=room))

                for d in dnames:
                    depart = depart_map.get(d)
                    if depart:
                        depart_links.append(
                            ClassLinkDepart(insa_class=insa_cls, depart=depart)
                        )

                for td in tdtags:
                    tdobj = td_map.get(td)
                    if tdobj:
                        td_links.append(ClassLinkTD(insa_class=insa_cls, td=tdobj))

            for chunk in chunked(teacher_links, batch_size):
                ClassLinkTeacher.objects.bulk_create(chunk, batch_size=batch_size)
            for chunk in chunked(room_links, batch_size):
                ClassLinkRoom.objects.bulk_create(chunk, batch_size=batch_size)
            for chunk in chunked(depart_links, batch_size):
                ClassLinkDepart.objects.bulk_create(chunk, batch_size=batch_size)
            for chunk in chunked(td_links, batch_size):
                ClassLinkTD.objects.bulk_create(chunk, batch_size=batch_size)

    # Writing stats for telegraf
    data = [
        f"edt,item=cours modifie={len(to_update)}i\n",
        f"edt,item=cours cree={len(to_create)}i\n",
        f"edt,item=cours supprime={nb_deleted}i\n",
    ]

    with open("td_telegraf.txt", 'w') as f:
        f.writelines(data)

    logger.info(
        "insert_list_record done: created=%d updated=%d deleted=%s total=%d",
        len(to_create),
        len(to_update),
        nb_deleted,
        len(new_uids),
    )
