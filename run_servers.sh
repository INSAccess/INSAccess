#!/bin/bash

cd ./backend/

make restart

cd ../front/ && npm start
