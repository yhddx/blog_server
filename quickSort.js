

function quickSort(elements){
    let len = elements.length;
    if(len<=1){
        return elements;
    }
    let middleIndex = Math.floor(len / 2);
    let pivotElement = elements[Math.floor(len / 2)];
    let left = [];
    let right = [];
    for(let i=0; i<len; i++){
        if(elements[i]<pivotElement){
            left.push(elements[i]);
        }
        if(elements[i]>pivotElement){
            right.push(elements[i]);
        }
    }
    return quickSort(left).concat(pivotElement,quickSort(right));
}
let elements = [5,6,2,1,3,8,7,1.2,5.5,4.5];
let newArray = quickSort(elements);
console.log(newArray);