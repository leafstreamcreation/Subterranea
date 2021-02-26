class Shuffler {
    constructor(array) {
        this.elements = array;
        let remainingElements = this.elements.length, elementToSwap, nextElementIndex;

        while (remainingElements > 0) {
            nextElementIndex = Math.floor(Math.random() * remainingElements--);
            elementToSwap = this.elements[remainingElements];
            this.elements[remainingElements] = this.elements[nextElementIndex];
            this.elements[nextElementIndex] = elementToSwap;
        }
    }
    
    drawNext() {
        return this.elements.pop();
    }
}