//usuario:hk23
//password:1234

class Usuario {
    constructor(usuario, password, pais) {
        this.usuario = usuario
        this.password = password
        this.pais = pais
    }
}

class UsuarioConectado {
    constructor(usuario, password) {
        this.usuario = usuario
        this.password = password
    }
}

class Ejercicio {
    constructor(idActividad, idUsuario, tiempo, fecha) {
        this.idActividad = idActividad
        this.idUsuario = idUsuario
        this.tiempo = tiempo
        this.fecha = fecha
    }
}

const MENU = document.querySelector("#menu")
const ROUTER = document.querySelector("#ruteo")
const HOME = document.querySelector("#pantalla-home")
const LOGIN = document.querySelector("#pantalla-login")
const REGISTRARU = document.querySelector("#pantalla-registrarU")
const REGISTRARE = document.querySelector("#pantalla-registrarE")
const LISTADO = document.querySelector("#pantalla-listado")
const INFORME = document.querySelector("#pantalla-informe")
const MAPA = document.querySelector("#pantalla-mapa")
let map
let listaActividades = []

const URLBASE = "https://movetrack.develotion.com/"

inicio()
function inicio() {
    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrarUsuario").addEventListener("click", previaRegistrarUsuario)
    document.querySelector("#btnHacerLogin").addEventListener("click", previaHacerLogin)
    document.querySelector("#btnHacerRegistroEjercicio").addEventListener("click", previaRegistrarEjercicio)
    document.querySelector("#btnMenuListado").addEventListener("click", previaListado)
    document.querySelector("#btnMenuLogout").addEventListener("click", cerrarSesion)
    document.querySelector("#btnMenuInforme").addEventListener("click", previaListado)
    document.querySelector("#btnMenuMapa").addEventListener("click", previaMapeado)
    obtenerPaises()
    chequearSesion()
}

function cerrarMenu() {
    MENU.close()
}


function chequearSesion() {
    ocultarMenu()
    if (localStorage.getItem("usuario") != null) {
        mostrarMenuVIP()
    } else {
        mostrarMenuComun()
    }
}

function navegar(evt) {
    let destino = evt.detail.to
    ocultarPantallas()
    if (destino == "/") HOME.style.display = "block"
    if (destino == "/login") LOGIN.style.display = "block"
    if (destino == "/registrarE") REGISTRARE.style.display = "block"
    if (destino == "/registrarU") REGISTRARU.style.display = "block"
    if (destino == "/listado") LISTADO.style.display = "block"
    if (destino == "/informe") INFORME.style.display = "block"
    if (destino == "/mapa") MAPA.style.display = "block"
}

function ocultarPantallas() {
    HOME.style.display = "none"
    LOGIN.style.display = "none"
    REGISTRARU.style.display = "none"
    REGISTRARE.style.display = "none"
    LISTADO.style.display = "none"
    INFORME.style.display = "none"
    MAPA.style.display = "none"
}

function obtenerPaises() {
    fetch(`${URLBASE}paises.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            cargarSelectPaises(informacion.paises)
        })
        .catch(function (error) {
            console.log(error)
        })
}


function cargarSelectPaises(listaPaises) {
    let miSelect = ""
    for (let unPais of listaPaises) {
        miSelect += `<ion-select-option value=${unPais.id}>${unPais.name}</ion-select-option>`
    }
    document.querySelector("#slcRegistrarUPais").innerHTML = miSelect
}

function previaRegistrarUsuario() {
    let usuario = document.querySelector("#txtRegistrarUUsuario").value
    let password = document.querySelector("#txtRegistrarUPassword").value
    let pais = document.querySelector("#slcRegistrarUPais").value
    if (!usuario || !password || !pais) {
        mostrarMensaje("ERROR", "Todos los campos son obligatorios", "Completa todos los datos", 2000);
        return
    }
    let nuevoUsuario = new Usuario(usuario, password, pais)
    hacerRegistroUsuario(nuevoUsuario)
}

function hacerRegistroUsuario(nuevoUsuario) {
    fetch(`${URLBASE}usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            if (informacion.codigo == "200") {
                mostrarMensaje("SUCCESS", "Registro exitoso", "Puedes usar la APP", 3000)
                ocultarPantallas()
                HOME.style.display = "block"
                localStorage.setItem("usuario", informacion.id)
                localStorage.setItem("apiKey", informacion.apiKey)
                ocultarMenu()
                mostrarMenuVIP()
            } else {
                mostrarMensaje("ERROR", "Datos incorrectos", "Revisa los datos", 3000)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function previaHacerLogin() {
    let usuario = document.querySelector("#txtLoginUsuario").value
    let password = document.querySelector("#txtLoginPassword").value
    let nuevoUsuarioConectado = new UsuarioConectado(usuario, password)
    hacerLogin(nuevoUsuarioConectado)
}


function hacerLogin(nuevoUsuarioConectado) {
    fetch(`${URLBASE}login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuarioConectado)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == "200") {

                ocultarPantallas()
                HOME.style.display = "block"
                localStorage.setItem("usuario", informacion.id)
                localStorage.setItem("apiKey", informacion.apiKey)
                ocultarMenu()
                mostrarMenuVIP()
            } else {
                mostrarMensaje("ERROR", "Datos incorrectos", "Revisa los datos", 3000)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function ocultarMenu() {
    document.querySelector("#btnMenuRegistrarU").style.display = "none"
    document.querySelector("#btnMenuLogin").style.display = "none"
    document.querySelector("#btnMenuRegistrarE").style.display = "none"
    document.querySelector("#btnMenuListado").style.display = "none"
    document.querySelector("#btnMenuInforme").style.display = "none"
    document.querySelector("#btnMenuMapa").style.display = "none"
    document.querySelector("#btnMenuLogout").style.display = "none"
}

function mostrarMenuComun() {
    document.querySelector("#btnMenuRegistrarU").style.display = "block"
    document.querySelector("#btnMenuLogin").style.display = "block"
}

function mostrarMenuVIP() {
    document.querySelector("#btnMenuRegistrarE").style.display = "block"
    document.querySelector("#btnMenuListado").style.display = "block"
    document.querySelector("#btnMenuInforme").style.display = "block"
    document.querySelector("#btnMenuMapa").style.display = "block"
    document.querySelector("#btnMenuLogout").style.display = "block"
    obtenerActividades()
}

function cerrarSesion() {
    ocultarPantallas()
    HOME.style.display = "block"
    ocultarMenu()
    mostrarMenuComun()
    localStorage.removeItem("usuario")
    localStorage.removeItem("apiKey")
}


function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dateRegistrarFecha").setAttribute("max", today);
})

function obtenerActividades() {
    fetch(`${URLBASE}actividades.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            cargarSelectActividades(informacion.actividades)
            listaActividades = informacion.actividades
        })
        .catch(function (error) {
            console.log(error)
        })
}


function cargarSelectActividades(listaActividades) {
    let miSelect = ""
    for (let unaActividad of listaActividades) {
        miSelect += `<ion-select-option value=${unaActividad.id}>${unaActividad.nombre}</ion-select-option>`
    }
    document.querySelector("#slcRegistrarActividad").innerHTML = miSelect
}


function previaRegistrarEjercicio() {
    let idActividad = document.querySelector("#slcRegistrarActividad").value
    let idUsuario = localStorage.getItem("usuario")
    let tiempo = document.querySelector("#dateRegistrarTiempo").value
    let fecha = document.querySelector("#dateRegistrarFecha").value
    if (!idActividad || !tiempo || !fecha) {
        mostrarMensaje("ERROR", "Todos los campos son obligatorios", "Completa todos los datos", 2000)
        return
    }
    if (isNaN(tiempo) || parseInt(tiempo) <= 0) {
        mostrarMensaje("ERROR", "Tiempo inválido", "Debe ser un número mayor a 0", 2000)
        return
    }
    const today = new Date().toISOString().split("T")[0];
    if (fecha > today) {
        mostrarMensaje("ERROR", "Fecha inválida", "No puedes seleccionar una fecha futura", 2000)
        return
    }
    let nuevoEjercicio = new Ejercicio(idActividad, idUsuario, tiempo, fecha);
    hacerRegistroEjercicio(nuevoEjercicio)
}

function hacerRegistroEjercicio(nuevoEjercicio) {
    fetch(`${URLBASE}registros.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        },
        body: JSON.stringify(nuevoEjercicio)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion.codigo)
            if (informacion.codigo == 200) {
                mostrarMensaje("SUCCESS", "Pedido registrado con exito", "", 2000)
                ocultarPantallas()
                HOME.style.display = "block"

            } else {
                mostrarMensaje("ERROR", "Datos incorrectos", "Revisa los datos", 2000)

            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function previaListado() {
    fetch(`${URLBASE}registros.php?idUsuario=${localStorage.getItem("usuario")}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            filtrarListado(informacion.registros)
            actualizarInforme(informacion.registros)
        })
        .catch(error => console.log(error))
}

function obtenerImagen(id) {
    const actividadEncontrada = listaActividades.find(actividad => actividad.id == id)
    if (actividadEncontrada && actividadEncontrada.imagen) {
        return `https://movetrack.develotion.com/imgs/${actividadEncontrada.imagen}.png`
    }
    return
}

function filtrarListado(listaEjercicios) {
    let filtro = document.querySelector("#filtroEjercicios").value;
    let fechaLimite = new Date()

    if (filtro === "semana") {
        fechaLimite.setDate(fechaLimite.getDate() - 7)
    } else if (filtro === "mes") {
        fechaLimite.setMonth(fechaLimite.getMonth() - 1)
    }

    let listaFiltrada = listaEjercicios.filter(ejercicio => {
        let fechaEjercicio = new Date(ejercicio.fecha);
        return filtro === "completo" || fechaEjercicio >= fechaLimite;
    })

    mostrarListado(listaFiltrada)
}

document.querySelector("#filtroEjercicios").addEventListener("ionChange", () => {
    previaListado()
})

function mostrarListado(listaEjercicios) {
    let contenedor = document.querySelector("#contenedorListado");
    contenedor.innerHTML = ""

    for (let unEjercicio of listaEjercicios) {
        let item = document.createElement("ion-item")
        item.innerHTML = `
        <ion-thumbnail slot="start">
                <img src="${obtenerImagen(unEjercicio.idActividad)}" alt="Ejercicio ${unEjercicio.idActividad}">
            </ion-thumbnail>
            <ion-label>
                <h3>Id de Actividad: ${unEjercicio.idActividad}</h3>
                <h3>Tiempo: ${unEjercicio.tiempo}</h3>
                <p>Fecha: ${unEjercicio.fecha}</p>
            </ion-label>
            <ion-button onclick="eliminarEjercicio(${unEjercicio.id})">Eliminar</ion-button>
        `;

        contenedor.appendChild(item)
    }
}

function eliminarEjercicio(id) {
    fetch(`${URLBASE}/registros.php?idRegistro=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            previaListado()
        })
        .catch(function (error) {
            console.log(error)
        })
}

function mismoDia(date, todayObj) {
    const parts = date.split("-")
    let d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.getFullYear() === todayObj.getFullYear() &&
        d.getMonth() === todayObj.getMonth() &&
        d.getDate() === todayObj.getDate()
}

function actualizarInforme(registros) {
    let totalMinutos = 0
    let minutosDiarios = 0
    let hoy = new Date()
    registros.forEach(registro => {
        totalMinutos += Number(registro.tiempo)
        if (mismoDia(registro.fecha, hoy)) {
            minutosDiarios += Number(registro.tiempo)
        }
    });

    document.getElementById("totalMinutos").textContent = totalMinutos;
    document.getElementById("minutosDiarios").textContent = minutosDiarios;
}

function previaMapeado() {
    if (map != null) {
        map.remove()
    }
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    cargarUbicaciones(map)
}

function cargarUbicaciones(map) {
    fetch(`${URLBASE}usuariosPorPais.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
    .then(function (response) {
        return response.json()
    })
        .then(async (informacion) => {
            console.log(informacion.paises);

            if (informacion.paises && informacion.paises.length > 0) {
                const top10Countries = informacion.paises.sort((a, b) => b.cantidadDeUsuarios - a.cantidadDeUsuarios).slice(0, 10);
                for (const country of top10Countries) {
                    const coords = await getCoordinates(country.name);
                    if (coords) {
                        L.marker([coords.lat, coords.lng])
                            .addTo(map)
                            .bindPopup(`<b>${country.name}</b><br>Usuarios: ${country.cantidadDeUsuarios}`);
                    }
                }
            } else {
                console.log("No se encontraron ubicaciones.");
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}


async function getCoordinates(countryName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${countryName}&format=json&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } else {
            console.warn(`No se encontraron coordenadas para ${countryName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener coordenadas para ${countryName}:`, error);
        return null;
    }
}