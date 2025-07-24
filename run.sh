#!/bin/bash

echo "Démarrage de l'application..."

echo "Construction des images..."
docker-compose build --no-cache

echo  "Démarrage du serveur CAS..."
docker-compose up -d cas-server

echo "Attente du serveur CAS..."
sleep 10

echo "Démarrage du backend Django..."
docker-compose up -d django

echo "Attente du backend..."
sleep 20

echo "Démarrage du frontend..."
docker-compose up -d frontend

echo "Suivi des logs..."
docker-compose logs -f