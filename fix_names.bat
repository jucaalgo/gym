@echo off
cd "public\exercises"
echo Renaming files...

if exist "bench-press.png" (
    rename "bench-press.png" "barbell-bench-press.png"
    echo Renamed bench-press.png
)

if exist "deadlift.png" (
    rename "deadlift.png" "barbell-deadlift.png"
    echo Renamed deadlift.png
)

if exist "lunge.png" (
    rename "lunge.png" "dumbbell-lunge.png"
    echo Renamed lunge.png
)

if exist "squat.png" (
    rename "squat.png" "barbell-squat.png"
    echo Renamed squat.png
)

echo Done.
