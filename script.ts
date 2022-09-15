import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/.';
import { resourceLimits } from "worker_threads";

type model = Array<{
    estado: string;
    poblacion: number;
    muertos: number;
    porcentaje: number;
}>;
let states: Array<{
  estado: string,
  poblacion: number,
  muertos: number,
  porcentaje: number
}> =[]
let resume: Array<{
  estado: string,
  poblacion: number,
  muertos: number
  porcentaje: number
}> =[]

const csvFilePath = path.resolve(__dirname, 'time_series_covid19_deaths_US.csv');
const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
let result 
result = parse(fileContent, {
    delimiter: ',',
}, (error, result: Array<model[]>) => {
if (error) {
  console.error(error);
}
result.forEach(data=>{
    states.push({
        estado: data[6].toString(),
        poblacion: +data[11],
        muertos: +data[data.length - 1],
        porcentaje: 0
    })
})
states.map((state)=>{
  let existe = false;
  for (var val of resume) {
    
    if (val.estado === state.estado) {
      existe = true;
      break;
    }
  }
  if(!existe){
    let aux1 = states.filter(dato => dato.estado === state.estado).reduce((a, b) => a + b.poblacion, 0);
    let aux2 = states.filter(dato => dato.estado === state.estado).reduce((a, b) => a + b.muertos, 0);
    let aux3 = +((aux2/aux1)*100).toFixed(2)
    resume.push({
      estado: state.estado,
      poblacion: aux1,
      muertos: aux2,
      porcentaje: aux3
  })
    
  }

});
console.log("*****************************************************************************************")
console.log(resume); //pregunta 4
console.log("*****************************************************************************************")
console.log("Estado con mayor acumulado a la fecha: "); //pregunta 1
console.log(resume.reduce(function(prev, current) {
  return (prev.muertos > current.muertos) ? prev : current
}));
console.log("*****************************************************************************************")
console.log("Estado con menor acumulado: "); //pregunta 2
console.log(resume.reduce(function(prev, current) {
  return (prev.muertos < current.muertos) ? prev : current
}));
console.log("*****************************************************************************************")
console.log("Estado mas afectado a la fecha: "); //pregunta 3
console.log(resume.reduce(function(prev, current) {
  return (prev.porcentaje > current.porcentaje) ? prev : current
}));
console.log("Este es el estado mas afectado hasta la fecha ya que tiene la tasa de mortalidad mas alta de todos los estados");
console.log("*****************************************************************************************")

});



