"use strict"

//elementos
let botonRojo = document.querySelector("div.red");
let botonAzul = document.querySelector("div.blue");
let botonAmarillo = document.querySelector("div.yellow");
let botonVerde = document.querySelector("div.green");
let botonInicioN = document.querySelector("button#inicioN");
let botonTutorial = document.querySelector("button#howtoplay");
let puntuacion = document.querySelector("p.puntos");
let ronda = document.getElementById("round");
let audio_rojo = document.getElementById("sound_rojo");
let audio_verde = document.getElementById("sound_verde");
let audio_amarillo = document.getElementById("sound_amarillo");
let audio_azul = document.getElementById("sound_azul");
let audio2 = document.getElementById("sound2");

//variables
let random = 0;
let contador = 0;
let contadorRonda = 1;
let colores = ["rojo", "azul", "amarillo", "verde"];
let secuenciaJugador = [];
let secuenciaSimon = [];

//variables de control
let juegoIniciado = false;
let turnoJugador = false;

//funciones
function pulsaBoton(color) {
    switch (color) {
        case "rojo":
            botonRojo.style.transform = "scale(1.1)";
            audio_rojo.play();
            setTimeout(() => {
                botonRojo.style.transform = "scale(1)";
            }, 200);
            break;
        case "azul":
            botonAzul.style.transform = "scale(1.1)";
            audio_azul.play();
            setTimeout(() => {
                botonAzul.style.transform = "scale(1)";
            }, 200);
            break;
        case "amarillo":
            botonAmarillo.style.transform = "scale(1.1)";
            audio_amarillo.play();
            setTimeout(() => {
                botonAmarillo.style.transform = "scale(1)";
            }, 200);
            break;
        case "verde":
            botonVerde.style.transform = "scale(1.1)";
            audio_verde.play();
            setTimeout(() => {
                botonVerde.style.transform = "scale(1)";
            }, 200);
            break;
    }
}

function accionSimon() {
    if (juegoIniciado) {
        random = Math.floor(Math.random() * 4);
        secuenciaSimon.push(colores[random]); //añade un nuevo color a la secuencia
        for (let i = 0; i < secuenciaSimon.length; i++) {
            setTimeout(() => pulsaBoton(secuenciaSimon[i]),
                i * 700); // por cada color en la secuencia, añade segundos equivalentes para que se vea su pulsación y no se superpongan (de lo contrario, visualmente los pulsaria a la vez, aunque haya un orden)
        }
        setTimeout(() => {
            turnoJugador = true;
        }, secuenciaSimon.length * 700); //esto hace que el turno del jugador se active al acabar la secuencia de simon.
    }
}

function pulsarColor(color) {
    if (turnoJugador) {
        secuenciaJugador.push(color);
        pulsaBoton(color);

        if (secuenciaJugador.length === secuenciaSimon.length) { //la primera vez siempre será la misma longitud, nunca saltará a la comprobación. 
            turnoJugador = false; //esto aquí (y no en accionSimon) evita que en la primera ronda, el jugador pulse varias veces el mismo botón, pues en el tiempo de espera del turno de Simon podría hacerlo
            if (compararSecuencias(secuenciaJugador, secuenciaSimon)) { //si compararSecuencias retorna true continua el juego.
                contadorRonda++;
                ronda.innerText = `Round ${contadorRonda}`;
                if (contadorRonda > 10) {
                    contador = contador * 2;
                } else {
                    contador += secuenciaSimon.length;
                }
                puntuacion.innerText = contador;
                secuenciaJugador = [];
                setTimeout(accionSimon, 900); // Espera 1 segundo antes de que Simon comience su turno, no se le llama con () cuando es un parametro del TimeOut
            } else {
                finJuego();
            }
        } else {
            compararPulsacion();
        }
    }
}

function compararPulsacion() {
    for (let i = 0; i < secuenciaJugador.length; i++) {
        if (secuenciaJugador[i] !== secuenciaSimon[i]) {
            finJuego();
        }
    }
}

function compararSecuencias(secuenciaSimon, secuenciaJugador) {
    for (let i = 0; i < secuenciaSimon.length; i++) {
        if (secuenciaSimon[i] !== secuenciaJugador[i]) {
            return false;
        }
    }
    return true;
}

function finJuego() {
    audio2.play();
    botonInicioN.innerText = "Restart";
    juegoIniciado = false;
    botonInicioN.disabled = false;
    turnoJugador = false;
    swal("You lost!", "Try again");
    contadorRonda = 1;
    contador = 0;
    ronda.innerText = `Round ${contadorRonda}`;
    puntuacion.innerText = contador;
}

//eventos
botonInicioN.addEventListener("click", () => {
    secuenciaJugador = [];
    secuenciaSimon = [];
    juegoIniciado = true;
    accionSimon();
    botonInicioN.style.transform = "scale(0.9)";
    botonInicioN.style.boxShadow = "0 0 10px rgba(41, 41, 41, 0.3)";
    setTimeout(() => {
        botonInicioN.style.transform = "scale(1)";
        botonInicioN.style.boxShadow = "";
    }, 400);
    botonInicioN.disabled = true;
});

botonRojo.addEventListener("click", () => {
    if (turnoJugador) {
        pulsarColor("rojo");
    }
});

botonAzul.addEventListener("click", () => {
    if (turnoJugador) {
        pulsarColor("azul");
    }
});

botonAmarillo.addEventListener("click", () => {
    if (turnoJugador) {
        pulsarColor("amarillo");
    }
});

botonVerde.addEventListener("click", () => {
    if (turnoJugador) {
        pulsarColor("verde");
    }
});

botonTutorial.addEventListener("click", ()=>{
    swal({
        title: "Normal Mode",
        text: "Simon will mark a sequence of colors that you must repeat. In each round, he will remind you of it completely along with the new color he decides to add. Let's start!"
    })
});