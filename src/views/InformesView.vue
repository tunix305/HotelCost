<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="60" contain />
        <div class="flex-grow-1 text-center">
          <span class="white--text font-weight-bold text-h6">Panel de Informes</span>
        </div>
        <v-btn class="custom-reservar-btn" @click="goToHome">REGRESAR</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="informes-fondo">
      <v-container fluid class="d-flex justify-center py-8">
        <v-card class="registro-card pa-6" elevation="12" max-width="1000">

          <!-- Resumen General -->
          <div class="mb-8">
            <h2 class="white--text text-h6 font-weight-medium text-center mb-4">
              Resumen General
            </h2>
            <v-row dense justify="space-around">
              <v-col cols="12" md="3">
                <v-card class="stats-card">
                  <h3 class="white--text mb-2">Ocupación Total</h3>
                  <p class="white--text text-h5">{{ ocupacionTotal }}%</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card class="stats-card">
                  <h3 class="white--text mb-2">Ingresos Mensuales</h3>
                  <p class="white--text text-h5">${{ ingresosMensuales }}</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card class="stats-card">
                  <h3 class="white--text mb-2">Rendimiento Mensual</h3>
                  <p class="white--text text-h5">{{ rendimientoMensual }}</p>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Generar Informes -->
          <div class="mb-8">
            <h2 class="white--text text-h6 font-weight-medium text-center mb-4">
              Generar Informes
            </h2>
            <v-form @submit.prevent="generateReport">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedReportType"
                    :items="['Ocupación','Ingresos','Rendimiento','Total']"
                    label="Tipo de Informe"
                    outlined dense required
                    class="custom-field"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="selectedMonth"
                    label="Mes"
                    readonly @click="monthDialog = true"
                    outlined dense required
                    class="custom-field"
                  />
                  <v-dialog v-model="monthDialog" max-width="290">
                    <v-card>
                      <v-date-picker v-model="month" type="month" locale="es" />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn text color="primary" @click="confirmarMes">Aceptar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                  v-model="comentario"
                    label="Comentario"
                    outlined dense rows="1"
                    class="custom-field"
                  />
                </v-col>
                <v-col cols="12" class="text-center mt-4">
                  <v-btn type="submit" block class="custom-reservar-btn">
                    Generar Informe
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>

          <!-- Informes Recientes -->
          <div>
            <h2 class="white--text text-h6 font-weight-medium text-center mb-4">
              Informes Recientes
            </h2>
            <v-data-table
              :headers="reportHeaders"
              :items="recentReports"
              dense
              hide-default-footer
              class="transparent-table"
            >
              <template v-slot:item.acciones="{ item }">
                <v-btn icon small @click="downloadReport(item)">
                  <v-icon color="yellow">mdi-download</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteReport(item.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </div>

        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import logo from '@/assets/logotiopo.png';

const router = useRouter();
const route  = useRoute();

const username = ref('');
const role     = ref('');

const ocupacionTotal     = ref(0);
const ingresosMensuales  = ref(0);
const rendimientoMensual = ref('');

const selectedReportType = ref('');
const selectedMonth      = ref('');
const month              = ref(null);
const monthDialog        = ref(false);
const comentario         = ref('');
const recentReports      = ref([]);

const reportHeaders = [
  { text: 'Tipo',     value: 'tipoInforme', sortable: false, class: 'white--text' },
  { text: 'Mes',      value: 'mes',         sortable: false, class: 'white--text' },
  { text: 'Generado', value: 'generadoEl',  sortable: false, class: 'white--text' },
  { text: 'Usuario',  value: 'usuario',     sortable: false, class: 'white--text' },
  { text: 'Acciones', value: 'acciones',    sortable: false, class: 'white--text' },
];

const goToHome = () => {
  router.push({
    path: '/home',
    query: {
      username: username.value || 'Invitado',
      role:     role.value     || 'Sin rol asignado',
    },
  });
};

const updateMonth = () => {
  const opts = { year: 'numeric', month: 'long' };
  selectedMonth.value = new Intl.DateTimeFormat('es-ES', opts).format(new Date(month.value));
};
const confirmarMes = () => { updateMonth(); monthDialog.value = false; };

const loadResumenGeneral = async () => {
  try {
    const { data } = await axios.get('https://www.hotelcost.somee.com/api/informes/resumen-general');
    ocupacionTotal.value     = data.porcentajeOcupacion;
    ingresosMensuales.value  = data.ingresosMensuales;
    rendimientoMensual.value = data.rendimiento;
  } catch (e) { console.error(e); }
};

const loadReports = async () => {
  try {
    const { data } = await axios.get('https://www.hotelcost.somee.com/api/informes');
recentReports.value = data.map(r => ({
  ...r,
  generadoEl: new Date(r.generadoEl).toLocaleDateString('es-ES'),
}));

  } catch (e) { console.error(e); }
};

const generateReport = async () => {
  if (!selectedReportType.value || !selectedMonth.value) {
    return alert('Selecciona tipo y mes.');
  }
  const nuevo = {
    tipoInforme: selectedReportType.value,
    mes:          selectedMonth.value,
    generadoEl:   new Date().toISOString(),
    usuario:      username.value || 'Invitado',
    comentario:   comentario.value,
  };
  try {
    await axios.post('https://www.hotelcost.somee.com/api/informes', nuevo);
    await loadReports();
    alert('Informe generado.');
    selectedReportType.value = '';
    selectedMonth.value      = '';
    comentario.value         = '';
  } catch (e) {
    console.error(e);
    alert('Error al generar informe.');
  }
};

const deleteReport = async id => {
  if (!confirm('¿Eliminar este informe?')) return;
  try {
    await axios.delete(`https://www.hotelcost.somee.com/api/informes/${id}`);
    await loadReports();
    alert('Informe eliminado.');
  } catch (e) {
    console.error(e);
    alert('Error al eliminar informe.');
  }
};

const downloadReport = reporte => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = logo;
  img.onload = () => {
    doc.addImage(img, 'PNG', 160, 10, 30, 30);
    doc.setFontSize(16);
    doc.text('Reporte de Hotel', 20, 30);
    doc.setFontSize(12);
    doc.text(`Tipo: ${reporte.tipoInforme}`, 20, 50);
    doc.text(`Mes: ${reporte.mes}`, 20, 60);
    doc.text(`Generado el: ${reporte.generadoEl}`, 20, 70);
    doc.text(`Usuario: ${reporte.usuario}`, 20, 80);
    if (reporte.comentario) doc.text(`Comentario: ${reporte.comentario}`, 20, 90);

    let y = 105;

    // Sección del resumen general
    switch (reporte.tipoInforme) {
      case 'Ingresos':
        doc.text(`Ingresos: $${ingresosMensuales.value}`, 20, y);
        y += 10;
        break;
      case 'Ocupación':
        doc.text(`Ocupación: ${ocupacionTotal.value}%`, 20, y);
        y += 10;
        break;
      case 'Rendimiento':
        doc.text(`Rendimiento: ${rendimientoMensual.value}`, 20, y);
        y += 10;
        break;
      case 'Total':
        doc.text('Informe Total:', 20, y);
        doc.text(`• Ingresos: $${ingresosMensuales.value}`, 25, y + 10);
        doc.text(`• Ocupación: ${ocupacionTotal.value}%`, 25, y + 20);
        doc.text(`• Rendimiento: ${rendimientoMensual.value}`, 25, y + 30);
        y += 45;
        break;
    }

    // Sección de habitaciones ocupadas con fechas
    if (reporte.habitaciones && reporte.habitaciones.length > 0) {
      doc.setFontSize(12);
      doc.text('Habitaciones ocupadas:', 20, y);
      y += 10;

      reporte.habitaciones.forEach(h => {
        doc.text(`• Habitación ${h.numero} (${h.tipo})`, 25, y);
        y += 7;

        if (h.fechas && h.fechas.length > 0) {
          h.fechas.forEach(f => {
            doc.text(`   - Del ${f.fechaInicio} al ${f.fechaFinal}`, 30, y);
            y += 6;
            if (y >= 270) {
              doc.addPage();
              y = 20;
            }
          });
        } else {
          doc.text(`   - Sin fechas registradas`, 30, y);
          y += 6;
        }
        y += 4;
      });
    }

    doc.save(`Informe_${reporte.tipoInforme}_${reporte.mes}.pdf`);
  };
};


onMounted(() => {
  if (route.query.username) {
    username.value = route.query.username;
    localStorage.setItem('loggedInUser', username.value);
  } else {
    username.value = localStorage.getItem('loggedInUser') || '';
  }
  if (route.query.role) {
    role.value = route.query.role;
    localStorage.setItem('userRole', role.value);
  } else {
    role.value = localStorage.getItem('userRole') || '';
  }

  loadResumenGeneral();
  loadReports();
});
</script>

<style scoped>
.informes-fondo {
  background-color: #22cbc3;
  min-height: 100vh;
  padding-top: 100px;
}

.registro-card {
  background-color: rgba(0,0,0,0.85);
  border-radius: 12px;
  color: white;
}

.stats-card {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  color: white;
}

.custom-field .v-input__control {
  background-color: rgba(255,255,255,0.08) !important;
  border-radius: 4px;
}

.custom-field input,
.custom-field textarea {
  color: white !important;
}

.custom-reservar-btn {
  background-color: #fbc02d !important;
  color: #1a1a1a !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.custom-reservar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* TABLA TRANSPARENTE */
.transparent-table {
  background-color: transparent !important;
}
.transparent-table .v-data-table__wrapper {
  background-color: transparent !important;
}
.transparent-table .v-data-table-header {
  background-color: transparent !important;
}
/* LETRAS EN BLANCO */
.transparent-table .v-data-table-header th,
.transparent-table .v-data-table__wrapper td {
  color: white !important;
  background-color: transparent !important;
}
.transparent-table tbody tr {
  background-color: transparent !important;
}
.transparent-table >>> td,
.transparent-table >>> th {
  color: white !important;
}

</style>
