#!/bin/bash

cd ./backend/

make restart

cd ../frontend/ && npm start
