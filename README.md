# router404

![Travis Status](https://api.travis-ci.org/ippei-tanaka/router404.svg?branch=master)

A primitive router

## Install the package via npm
```npm install --save-dev router404```

## Usage

### Basic
```javascript
import {buildRouter} from 'router404';
 
const router = buildRouter({
    '/users/:name/*': ({params: {name}, wildcards}) => 
        `<div>This is ${name}. The rest of the matching path is ${wildcards[0]}.</div>`
});
 
console.log(router('/users/Me/1/2')); // <div>This is Me. The rest of the matching path is 1/2.</div>
```

### Nesting
```javascript
import {buildRouter} from 'router404';
 
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