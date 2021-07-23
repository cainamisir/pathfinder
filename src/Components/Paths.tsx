import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import { Button, Tabs, Tab } from "@material-ui/core";
import { GiBrickWall } from "react-icons/gi";
import { MdLocationCity, MdDirectionsRun } from "react-icons/md";

import "./Paths.scss";
export default function Paths() {
    let time = 0;
    const [grid, setGrid] = useState([] as any);
    const [startSet, setStartSet] = useState(false);
    const [endSet, setEndSet] = useState(false);
    const [newCellType, setNewCellType] = React.useState(0);

    const [gridProperties, setGridProperties] = useState({
        start: {},
        end: {},
    });
    const directionsX = [-1, 0, 1, 0];
    const directionsY = [0, 1, 0, -1];
    useEffect(() => {
        let newGrid = [];
        for (let i = 0; i <= 19; i++) {
            let newRow = [];
            for (let j = 0; j <= 19; j++) {
                newRow.push({
                    row: i,
                    column: j,
                    cellClass: "cell",
                    type: "cell",
                    isStart: false,
                    isEnd: false,
                });
            }
            newGrid.push(newRow);
        }
        setGrid(newGrid);
        console.log(grid);
    }, []);
    function handleClick(cell: any) {
        let newCell = cell;
        console.log(cell);
        console.log("test");
        console.log(startSet);
        if (startSet === false) {
            newCell.isStart = true;
            gridProperties.start = newCell;
            setGridProperties(gridProperties);
            setStartSet(true);
            setNewCellType(1);
        } else if (endSet === false && newCell !== gridProperties.start) {
            newCell.isEnd = true;
            gridProperties.end = newCell;
            setGridProperties(gridProperties);
            setEndSet(true);
            setNewCellType(2);
        } else if (endSet === true && startSet === true) {
            newCell.cellClass = "wall";
        }
        let newGrid = [...grid];
        newGrid[newCell.row][newCell.column] = newCell;
        setGrid(newGrid);
    }
    function Lee() {
        let start = gridProperties.start as any;
        let end = gridProperties.end as any;
        let distance = 0;
        let queue = [];
        start.distance = 0;
        queue.push(start);
        let newGrid = [...grid];
        while (queue.length > 0) {
            if (queue[0].cellClass !== "visited") {
                console.log(queue);
                newGrid = [...grid];
                let currentCell = queue[0] as any;
                currentCell.cellClass = "visited";
                currentCell.time = time;
                time += 1;
                if (
                    currentCell.row === end.row &&
                    currentCell.column === end.column
                ) {
                    distance = currentCell.distance;
                    break;
                }
                newGrid[currentCell.row][currentCell.column] = currentCell;
                setGrid(newGrid);

                for (let dir = 0; dir < 4; dir++) {
                    if (
                        currentCell.row + directionsX[dir] >= 0 &&
                        currentCell.row + directionsX[dir] < 20 &&
                        currentCell.column + directionsY[dir] >= 0 &&
                        currentCell.column + directionsY[dir] < 20 &&
                        newGrid[currentCell.row + directionsX[dir]][
                            currentCell.column + directionsY[dir]
                        ].cellClass !== "visited" &&
                        newGrid[currentCell.row + directionsX[dir]][
                            currentCell.column + directionsY[dir]
                        ].cellClass !== "wall"
                    ) {
                        let nextCell =
                            newGrid[currentCell.row + directionsX[dir]][
                                currentCell.column + directionsY[dir]
                            ];
                        if (nextCell.cellClass !== "visited") {
                            nextCell.distance = currentCell.distance + 1;
                            queue.push(nextCell);
                        }
                    }
                }
            }
            queue.shift();
        }
        let cell = end;
        console.log(distance);
        setTimeout(() => {
            time = distance;
            while (distance > 0) {
                for (let dir = 0; dir < 4; dir++) {
                    if (
                        cell.row + directionsX[dir] >= 0 &&
                        cell.row + directionsX[dir] < 20 &&
                        cell.column + directionsY[dir] >= 0 &&
                        cell.column + directionsY[dir] < 20 &&
                        grid[cell.row + directionsX[dir]][
                            cell.column + directionsY[dir]
                        ].distance ===
                            distance - 1
                    ) {
                        distance--;
                        cell =
                            grid[cell.row + directionsX[dir]][
                                cell.column + directionsY[dir]
                            ];
                        cell.cellClass = "shortest-path";
                        cell.distance = distance;
                        cell.time = time;
                        let newGrid = [...grid];
                        newGrid[cell.row][cell.column] = cell;
                        setGrid(newGrid);
                    }
                }
                time--;
            }
        }, time * 7 + 1000);

        console.log(grid);
    }
    const handleTabChange = (
        event: React.ChangeEvent<{}>,
        newValue: number
    ) => {
        console.log(gridProperties.start === {});
        if (newValue === 1 && !gridProperties.start) {
            return;
        }
        if (newValue === 2 && (!gridProperties.start || !gridProperties.end)) {
            return;
        }
        setNewCellType(newValue);
    };
    return (
        <div className="content-wrapper">
            <h1 className="title"> Path finding visualizer </h1>
            <div className="main-content">
                <div className="grid">
                    {grid.map((row: any[]) => {
                        return row.map((cell, nodeId) => {
                            return (
                                <div
                                    onClick={() => handleClick(cell)}
                                    className="cell-wrapper"
                                >
                                    <Cell
                                        key={nodeId}
                                        cellClass={cell.cellClass}
                                        isStart={cell.isStart}
                                        isEnd={cell.isEnd}
                                        time={cell.time}
                                    ></Cell>
                                </div>
                            );
                        });
                    })}
                </div>
                <div className="controls">
                    <Tabs
                        value={newCellType}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="secondary"
                        aria-label="icon label tabs example"
                        className="selection-tabs"
                    >
                        <Tab icon={<MdDirectionsRun />} label="Start" />
                        <Tab icon={<MdLocationCity />} label="End" />
                        <Tab icon={<GiBrickWall />} label="Walls" />
                    </Tabs>
                </div>
                <Button
                    onClick={Lee}
                    variant="contained"
                    disableElevation
                    className="play-button"
                >
                    Play
                </Button>
            </div>
        </div>
    );
}
