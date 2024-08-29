/* eslint-disable */

// Простейшая типизация
let a = 10; // тип number
a = '20'; // Ошибка
const b = a * 2; // тип number

let arr = [1, 2, 3]; // тип number[]
arr.push('4'); // Ошибка

{
  // явная типизация
  const b: number = 10;
  const c: string = 'Hello';
  const d: boolean = true;
  const e: any = JSON.parse(str);
  const arr2: number[] = [1, 2, 3];
}

// типизация функций
function sum(a: number, b: number): number {
  return a + b;
}
const s = sum(1, 2);

// можно не указывать тип возвращаемого значения, но я рекоменду укзывать всегда (по крайней мере на первых порах)
function makePair(a: number, b: string): [number, string] {
  return [a, b];
}

// собственные типы
type Gender = 'male' | 'female' | 'unknown'; // union type
type GenderExtended = Gender | 'nonbinary' | 'battle helicopter';

// тип объекта (интерфейс)
type User = {
  name: string;
  // опциональное свойство
  email?: string;
  age: number;
  gender: GenderExtended;
};

const userIncorrect: User = {
  name: 'John',
  email: 'john@gmail.com',
  age: 20,
};

const user: User = {
  name: 'John',
  email: 'john@gmail.com',
  age: 20,
  gender: 'male',
};

user.gender = 'мужык';

// опциональные (nullable) поля
const userNoMail: User = {
  name: 'John',
  age: 20,
  gender: 'male',
};

// типы можно вместе с обявлением переменной
const userGender: 'male' | 'female' | 'nonbinary' = 'male';
const user2: {
  name: string;
  age: number;
  gender: Gender;
} = {
  name: 'John',
  age: 20,
  gender: 'male',
};

// тип функции
type MyFunction = (a: number, b: number) => number;

const func: MyFunction = (a, b) => a + b;

// обнуляемые типы
let user3: User;
console.log(user3);

let user4: User | undefined;
console.log(user4);

// приведение типов

// div может быть null
const div = document.querySelector('#my-div');
// error
div.remove();

if (div) {
  div.remove();
}
div?.remove();

// (not-null assertion)
div!.remove();

const div2 = document.querySelector('#my-div')!;
div2.remove();

// as
const form = document.querySelector('#my-form');
form!.reset(); // Ошибка

const form2 = document.querySelector('#my-form') as HTMLFormElement;
form2.reset();

// для большей безопасности
if (form instanceof HTMLFormElement) {
  form.reset();
} else {
  console.log('Это не форма');
}
