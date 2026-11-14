// console.log("hello world");

// Types of datatypes in typescript:- 
// 1. string
// 2. number
// 3. boolean
// 4. null
// 5. undefined
// 6. object
// 7. array
// 8. tuple
// 9. enum
// 10. any
// 11. void
// 12. never
// Any
// unknown

// const a: string = "hello world"
// console.log(a.toUpperCase())

// const a: number =20
// console.log(a)


// array = fixed type but not length
// const arr : number[] = [1, 4, 5]
// arr.push(20,30)
// console.log(arr)


// tuple = fixed type and fixed length
// const tuple : [number, string, boolean] = [30, "devesh", true]
// console.log(tuple);


// function greet(name:string) {
//     return "hello " + name
// }
// console.log(greet("devesh"));


// void = function without return value
// function greet(name: string) : void{
//     console.log("Hello " + name)
// }
// greet("Devesh")

//never = never means a function will never successfully finish or return a value
// function greet(name:string): never{
//     throw new Error("something went wrong")
// }
// greet("devesh")

// any = accepts all type of data Types 
// any means TypeScript stops checking the type of a variable.
// // let a: any = "Hello"
// let a: any = 100
// console.log(a);


// unknown = accepts all type of data types with condition
// unknown also accepts any value, but you cannot directly use it without checking its type.

const a : unknown = 30
if(typeof a === "string")
    console.log(a.toUpperCase());
else
    console.log("other data type");
    
    


