function dragElement(elem) {

    let draggedAlongX = 0,
        draggedAlongY = 0,
        initialCoordX = 0,
        initialCoordY = 0;

    if (document.getElementById(elem.id + "head")) {
        document.getElementById(elem.id + "head").onmousedown = setUpDragging;
    } else {
        elem.onmousedown = setUpDragging;
    }

    function setUpDragging(e) {
        e = e || window.event;
        e.preventDefault();

        initialCoordX = e.clientX;
        initialCoordY = e.clientY;

        document.onmousemove = startDragging;
        document.onmouseup = stopDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();

        draggedAlongX = initialCoordX - e.clientX;
        draggedAlongY = initialCoordY - e.clientY;

        elem.style.left = (elem.offsetLeft - draggedAlongX) + "px";
        elem.style.top = (elem.offsetTop - draggedAlongY) + "px";


        initialCoordX = e.clientX;
        initialCoordY = e.clientY;
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

dragElement(document.getElementById('sampledrag'));