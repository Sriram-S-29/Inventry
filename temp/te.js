const obj = [
    {
        id:1,
        name:'sri',
        class:'mca'
    },
    {
        id:1,
        name:'sri',
        class:'mba'
    },
    {
        id:2,
        name:'sri',
        class:'mca'
    },
    {
        id:3,
        name:'sri',
        class:'mba'
    }
]
let a = ['q','e','r','e',['v',['h',['o',['x']]]]]

let result  =  obj.some((i)=>{
    return i.id==3&&i.name=='sri'
})
console.log(obj.toString())

console.log('df'.split('').reverse().join(''))

console.log(obj.lastIndexOf({id:3,
    name:'sri',
    class:'mba'}))
console.log(a.findIndex(i=>i==='e'))
console.log(obj.findIndex(i=>{
    return i.id==5&&i.name=='sri'
}))


console.log(a.lastIndexOf('e',2))
console.log(a.findIndex(i=>i=='e'))
console.log(a.includes('q'))

console.log(Array.from({'s':'1'}))

console.log(a.flatMap((x)=>[x,x+'2'+'56']))


let no = Date.now()+
console.log(no)
let to = Date.now()
console.log(to-no)