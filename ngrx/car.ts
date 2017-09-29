/** ES6 */
/** ========================================== */

/* Clases */

class Vehiculo {
    ruedas;
    velocidad
    constructor(ruedas, velocidad){
        this.ruedas = ruedas;
        this.velocidad = velocidad;
    }

    aumentarVelodicad (){
        this.velocidad += 10;
    }
}

// interface Vehiculo {
//     ruedas;
//     velocidad;
//     aumentarVelodicad();
// }

class Auto extends Vehiculo {
    capacidad;
    constructor(ruedas, velocidad, capacidad){
        super(ruedas, velocidad);
        this.capacidad = capacidad;
    }

    aumentarVehiculo() {
        this.velocidad += 20;
    }
}

var moto = new Vehiculo(2, 25);
var auto2 = new Auto(4,25, 2);

moto.aumentarVelodicad(); //35
auto2.aumentarVehiculo(); //45

/* Arrow Functions*/

/* Template Strings */

var a = 'hellow';
var b = 'marco';

console.log(a + 'mi nombre es ' + b);
console.log(`${a} mi nombre es ${b}`);
