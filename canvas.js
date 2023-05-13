/*
** EPITECH PROJECT, 2022
** Test-stage-endless-paper
** File description:
** canva.js
*/

var canvas = document.getElementById('canvas');
var circle = canvas.getContext('2d'); //choose the plan of the canvas
var is_drawing = false;
var selection = false;
var resize = false;
var clock = 0;
var x, y = (0, 0);
var mx, my = (0, 0);
var radius = 1;
var arr_circle = [];
var current_circle = null;

function is_outline_circle(x, y, circle)
{
    var dx = circle.x - x;
    var dy = circle.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(distance - circle.radius) <= 3 / 2)
        return true;
    return false;
}

function is_inside_circle(x, y, circle)
{
    var dx = circle.x - x;
    var dy = circle.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= circle.radius)
        return true;
    return false;
}

function resize_circle(mouseX, mouseY) {
    var dx = arr_circle[current_circle].x - mouseX;
    var dy = arr_circle[current_circle].y - mouseY;
    arr_circle[current_circle].radius = Math.sqrt(dx * dx + dy * dy);
    circle.clearRect(0, 0, canvas.width, canvas.height);
    redrawCircles();
}

function mouse_pressed_event(event)
{
    if (selection == false){
        draw(event);
        return;
    } //search if click is on a circle
    for (var i = arr_circle.length - 1; i >= 0; i--) {
        if (is_outline_circle(event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop, arr_circle[i]) == true) {
            current_circle = i;
            resize = true;
            return;
        }
        if (is_inside_circle(event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop, arr_circle[i]) == true) {
            current_circle = i;
            return;
        }
    }
}

function mouse_moved_event(event) {
    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;
    if (current_circle !== null) {
        if (is_outline_circle(mouseX, mouseY, arr_circle[current_circle]) || resize === true) {
            resize_circle(mouseX, mouseY);
        } else {
            arr_circle[current_circle].x = mouseX;
            arr_circle[current_circle].y = mouseY;
            circle.clearRect(0, 0, canvas.width, canvas.height);
            redrawCircles();
        }
    } else if (is_drawing) {
        calcul_size(event);
    }
}

function mouse_released_event(event)
{
    resize = false;
    if (current_circle === null)
        change_is_drawing(event);
    else
        current_circle = null;
}

//reset when not drawing
function change_is_drawing(event)
{
    if (is_drawing == false)
        return;
    arr_circle.push({x: x, y: y, radius: radius});  // store the circle
    is_drawing = false;
    radius = 1;
    redrawCircles();
}

function draw(event)
{
    is_drawing = true;
    clock = Date.now();
    x = event.clientX - canvas.offsetLeft; //set x and y of start position
    y = event.clientY - canvas.offsetTop;
    mx = event.clientX; //set x and y of mouse start position
    my = event.clientY;
    calcul_size(event)
}

function calcul_size(event)
{
    if (is_drawing == false)
        return;
    var dx = event.clientX - mx;
    var dy = event.clientY - my;
    var distance = Math.sqrt(dx * dx + dy * dy);
    radius = 1 + distance;
    circle.clearRect(0, 0, canvas.width, canvas.height);  // clear the canvas
    redrawCircles();
    draw_circle();
}

// draw preview circle
function draw_circle()
{
    circle.beginPath();
    circle.arc(x, y, radius, 0, 2 * Math.PI, true); // size and coordinate of the circle
    circle.strokeStyle = 'blue';
    circle.lineWidth = 3;
    circle.stroke(); // draw the circle stroke == outline
}

function draw_tangent(tangent1x, tangent1y, tangent2x, tangent2y)
{
    circle.beginPath();
    circle.moveTo(tangent1x, tangent1y);
    circle.lineTo(tangent2x, tangent2y);
    circle.strokeStyle = 'red';
    circle.lineWidth = 3;
    circle.stroke();
}

function calcul_tangent(circle1, circle2)
{
    var dx = circle2.x - circle1.x;
    var dy = circle2.y - circle1.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var a = Math.atan2(dy, dx);
    var b = Math.acos((circle1.radius - circle2.radius) / distance);
    var angle1 = a - b; //tangent 1
    var tangent1x = circle1.x + circle1.radius * Math.cos(angle1);
    var tangent1y = circle1.y + circle1.radius * Math.sin(angle1);
    var tangent2x = circle2.x + circle2.radius * Math.cos(angle1);
    var tangent2y = circle2.y + circle2.radius * Math.sin(angle1);
    var angle2 = a + b; //tangent 2
    var tangent3x = circle1.x + circle1.radius * Math.cos(angle2);
    var tangent3y = circle1.y + circle1.radius * Math.sin(angle2);
    var tangent4x = circle2.x + circle2.radius * Math.cos(angle2);
    var tangent4y = circle2.y + circle2.radius * Math.sin(angle2);
    draw_tangent(tangent1x, tangent1y, tangent2x, tangent2y);
    draw_tangent(tangent3x, tangent3y, tangent4x, tangent4y);
}

// draw final circles
function redrawCircles() {
    for (var i = 0; i < arr_circle.length; i++) {
        var circ = arr_circle[i];
        circle.beginPath();
        circle.arc(circ.x, circ.y, circ.radius, 0, 2 * Math.PI, true);
        circle.strokeStyle = 'blue';
        circle.lineWidth = 3;
        circle.stroke();
        if (arr_circle.length > 1 && i < arr_circle.length - 1)
            calcul_tangent(circ, arr_circle[i + 1]);
    }
}

function selection_event(event)
{
    selection = true;
}

function draw_event(event)
{
    selection = false;
}

function clear_event(event)
{
    arr_circle.length = 0;
    circle.clearRect(0, 0, canvas.width, canvas.height);
}

//link functions with events
canvas.addEventListener('mousedown', mouse_pressed_event);
canvas.addEventListener('mousemove', mouse_moved_event);
canvas.addEventListener('mouseup', mouse_released_event);
document.getElementById('selection').addEventListener('click', selection_event);
document.getElementById('draw').addEventListener('click', draw_event);
document.getElementById('clear').addEventListener('click', clear_event);
