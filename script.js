//var (global)nombre de la variable;//
//let (no global) nombre variable solo en uno en que este definido//
//const (no se puede modifiar) nombre de la variable//

console.log("Hola");
const boton = document.getElementById("boton");
boton.addEventListener("click", function(){
    console.log("Estoy dentro del boton");
});
