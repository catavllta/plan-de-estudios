import { useState, useEffect } from "react";

const estados = [
  { label: "Bloqueada", color: "bg-gray-300" },
  { label: "Disponible", color: "bg-blue-200" },
  { label: "Cursando", color: "bg-yellow-200" },
  { label: "Regular", color: "bg-orange-200" },
  { label: "Aprobada", color: "bg-green-300" },
];

// Mapeo completo de materias
const materias = [
  // CBC
  "IPC","Sociedad y Estado","Química","Biofísica","Biología Celular","Matemática",

  // Primer año
  "Anatomía","Histología","Embriología","Genética",

  // Segundo año
  "Fisiología","Bioquímica","Inmunología","Microbiología",

  // Medicina
  "Medicina A","Patología","Farmacología I","Medicina Legal","Toxicología","Farmacología II",

  // Clínicas
  "Medicina B","Nutrición","Dermatología","Infectología","Neumonología","Neurología","Diagnóstico por Imágenes","Psiquiatría",

  // Quirúrgicas
  "Pediatría","Obstetricia","Ginecología","Cirugía General","Urología","Traumatología","Oftalmología","ORL","Neurocirugía",

  // Extras
  "Salud Mental","Salud Pública","Bioética","Inglés Técnico",

  // PFO
  "Medicina Familiar","Emergentología","Prácticas Comunitarias"
];

// Reglas EXACTAS según lo que me pasaste
const reglas = {
  // CBC → Primer año
  "Anatomía": { dependeDe: ["IPC","Sociedad y Estado","Química","Biofísica","Biología Celular","Matemática"], requiere: "Aprobada" },
  "Histología": { dependeDe: ["IPC","Sociedad y Estado","Química","Biofísica","Biología Celular","Matemática"], requiere: "Aprobada" },
  "Embriología": { dependeDe: ["IPC","Sociedad y Estado","Química","Biofísica","Biología Celular","Matemática"], requiere: "Aprobada" },
  "Genética": { dependeDe: ["IPC","Sociedad y Estado","Química","Biofísica","Biología Celular","Matemática"], requiere: "Aprobada" },

  // Segundo año
  "Fisiología": { dependeDe: ["Anatomía","Histología"], requiere: "Aprobada" },
  "Bioquímica": { dependeDe: ["Anatomía","Histología"], requiere: "Aprobada" },
  "Inmunología": { dependeDe: ["Anatomía","Histología"], requiere: "Aprobada" },
  "Microbiología": { dependeDe: ["Bioquímica","Inmunología"], requiere: "Regular" },

  // Medicina
  "Medicina A": { dependeDe: ["Fisiología","Microbiología"], requiere: "Aprobada" },
  "Patología": { dependeDe: ["Medicina A"], requiere: "Aprobada" },
  "Farmacología I": { dependeDe: ["Medicina A"], requiere: "Aprobada" },
  "Farmacología II": { dependeDe: ["Farmacología I","Medicina A"], requiere: "Regular" },
  "Toxicología": { dependeDe: ["Farmacología I"], requiere: "Aprobada" },
  "Medicina Legal": { dependeDe: ["Medicina A"], requiere: "Aprobada" },

  // Clínicas
  "Medicina B": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Nutrición": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Dermatología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Infectología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Neumonología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Neurología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Diagnóstico por Imágenes": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Psiquiatría": { dependeDe: ["Salud Mental"], requiere: "Aprobada" },

  // Quirúrgicas
  "Pediatría": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Obstetricia": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Ginecología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Cirugía General": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Urología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Traumatología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Oftalmología": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "ORL": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },
  "Neurocirugía": { dependeDe: ["Medicina A","Patología"], requiere: "Aprobada" },

  // PFO
  "Medicina Familiar": { dependeDe: materias, requiere: "Aprobada" },
  "Emergentología": { dependeDe: materias, requiere: "Aprobada" },
  "Prácticas Comunitarias": { dependeDe: materias, requiere: "Aprobada" },
};

function cumple(materia, estadoMaterias) {
  const regla = reglas[materia];
  if (!regla) return true;

  return regla.dependeDe.every((dep) => {
    const estadoIndex = estadoMaterias[dep];
    if (estadoIndex === undefined) return false;

    const estado = estados[estadoIndex].label;

    if (regla.requiere === "Aprobada") return estado === "Aprobada";
    if (regla.requiere === "Regular") return estado === "Regular" || estado === "Aprobada";

    return false;
  });
}

export default function App() {
  const [estadoMaterias, setEstadoMaterias] = useState(() => {
    const saved = localStorage.getItem("estado");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("estado", JSON.stringify(estadoMaterias));
  }, [estadoMaterias]);

  const cambiarEstado = (materia) => {
    if (!cumple(materia, estadoMaterias)) return;

    const actual = estadoMaterias[materia] ?? 1;
    const nuevo = (actual + 1) % estados.length;

    setEstadoMaterias({ ...estadoMaterias, [materia]: nuevo });
  };

  const renderMateria = (m) => {
    const habilitada = cumple(m, estadoMaterias);
    const estadoIndex = estadoMaterias[m] ?? (habilitada ? 1 : 0);
    const estado = estados[estadoIndex];

    return (
      <button
        key={m}
        onClick={() => cambiarEstado(m)}
        className={`p-2 rounded-xl text-left ${estado.color} ${!habilitada && "opacity-50"}`}
      >
        <div className="font-medium">{m}</div>
        <div className="text-sm">{estado.label}</div>
      </button>
    );
  };

  const bloques = {
    "CBC": materias.slice(0,6),
    "Primer Año": materias.slice(6,10),
    "Segundo Año": materias.slice(10,14),
    "Medicina": materias.slice(14,20),
    "Clínicas": materias.slice(20,28),
    "Quirúrgicas": materias.slice(28,37),
    "Extras": materias.slice(37,41),
    "PFO": materias.slice(41)
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Plan de Medicina Interactivo</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(bloques).map(([cat, lista]) => (
          <div key={cat} className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">{cat}</h2>
            <div className="flex flex-col gap-2">
              {lista.map(renderMateria)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
