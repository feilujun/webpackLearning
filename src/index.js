
import data from './data.json'
import $ from 'jquery';
import styles from './index.css'
import styless from './index.less'

$('#title').click(() => {
    $('body').css('backgroundColor', 'deeppink')
})
console.log(data)

function add(x, y) {
    return x + y;
}

console.log(add(1, 2))