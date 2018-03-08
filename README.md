# Chibi Router

![Travis Status](https://api.travis-ci.org/ippei-tanaka/chibi-router.svg?branch=master)

A tiny and powerful router

## Install the package via npm
```npm install --save-dev chibi-router```

## Usage

### Basic
```javascript
import {buildRouter} from 'chibi-router';
 
const router = buildRouter({
    '/users/:name/*': ({params: {name}, wildcards}) => 
        `<div>This is ${name}. The rest of the matching path is ${wildcards[0]}.</div>`
});
 
console.log(router('/users/Me/1/2')); // <div>This is Me. The rest of the matching path is 1/2.</div>
```

### Nesting
```javascript
import {buildRouter} from 'chibi-router';
 
const childRouter = buildRouter({
    '/products/:name': ({params: {name}}) => 
        `<div>Product is ${name}</div>`,
    '/users/:name': ({params: {name}}) => 
        `<div>User is ${name}</div>`
});

const parentRouter = buildRouter({
    '/admin/*': ({wildcards}) => 
        `<div>This is Admin Page. ${childRouter(wildcards[0])}</div>`
});
 
console.log(parentRouter('/admin/products/candle')); 
// <div>This is Admin Page. <div>Product is candle</div></div>

console.log(parentRouter('/admin/users/Me')); 
// <div>This is Admin Page. <div>User is Me</div></div>
```