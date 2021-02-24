class Grid {
    constructor(width, size) {
        this.elements = [];
        this.size = size;
        const gridElementScale = Math.floor(width / size);
        for (let i = 0; i < size; i++) {
            this.elements.push([]);
            for (let j = 0; j < size; j++) {
                this.elements[i].push(new GridElement(j, i, gridElementScale));
            } 
        }
    }
}

//TODO: Finish Grid and utilize it in subterraneagameviewcontroller