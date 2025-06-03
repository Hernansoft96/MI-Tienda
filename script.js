document.addEventListener('DOMContentLoaded', () => {
  // Animación para la botella
  gsap.to('#botella', {
    x: 300, duration: 4, ease: 'power1.inOut', repeat: -1, yoyo: true
  });

  // Formularios de las mesas
  const formularios = {
    mesa1: document.querySelector('#formMesa1'),
    mesa2: document.querySelector('#formMesa2'),
    mesa3: document.querySelector('#formMesa3'),
  };

  // Datos globales para los balances
  const balances = { mesa1: 0, mesa2: 0, mesa3: 0 };

  // Función para actualizar el gráfico
  function actualizarGrafico() {
    const ctx = document.getElementById('graficoBalances').getContext('2d');
    // Destruir el gráfico anterior y crear uno nuevo con los datos actualizados
    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mesa 1', 'Mesa 2', 'Mesa 3'],
        datasets: [{
          label: 'Consumo Total ($ COP)',
          data: Object.values(balances), // Datos actualizados
          backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `$${tooltipItem.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  // Función para registrar consumo
  function registrarConsumo(mesa) {
    const productoInput = document.querySelector(`#producto${mesa.charAt(0).toUpperCase() + mesa.slice(1)}`);
    const precioInput = document.querySelector(`#precio${mesa.charAt(0).toUpperCase() + mesa.slice(1)}`);
    const producto = productoInput.value.trim();
    const precio = parseFloat(precioInput.value);

    if (!producto || isNaN(precio) || precio <= 0) {
      alert('Por favor, ingresa un producto válido y un precio mayor a 0.');
      return;
    }

    // Actualizar historial
    const historial = document.querySelector(`#${mesa}-historial`);
    const nuevoElemento = document.createElement('li');
    nuevoElemento.className = 'list-group-item';
    nuevoElemento.textContent = `${producto} - $${precio.toFixed(2)} COP`;
    historial.appendChild(nuevoElemento);

    // Actualizar total de la mesa
    const totalElemento = document.querySelector(`#${mesa}-total`);
    const totalActual = parseFloat(totalElemento.dataset.total);
    const nuevoTotal = totalActual + precio;
    totalElemento.dataset.total = nuevoTotal.toFixed(2);
    totalElemento.textContent = `$${nuevoTotal.toFixed(2)} COP`;

    // Actualizar balance global
    balances[mesa] = nuevoTotal;

    productoInput.value = '';
    precioInput.value = '';

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.querySelector(`#modal${mesa.charAt(0).toUpperCase() + mesa.slice(1)}`));
    modal.hide();

    // Actualizar gráfico
    actualizarGrafico();
  }

  // Función para borrar cuenta
  function borrarCuenta(mesa) {
    const historial = document.querySelector(`#${mesa}-historial`);
    historial.innerHTML = '';

    const totalElemento = document.querySelector(`#${mesa}-total`);
    totalElemento.dataset.total = '0';
    totalElemento.textContent = '$0 COP';

    // Reiniciar balance global
    balances[mesa] = 0;

    // Actualizar gráfico
    actualizarGrafico();
  }

  // Eventos de los formularios y botones
  Object.keys(formularios).forEach(mesa => {
    formularios[mesa].addEventListener('submit', (e) => {
      e.preventDefault();
      registrarConsumo(mesa);
    });
  });

  // Manejar los botones "Borrar Cuenta"
  document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', (e) => {
      borrarCuenta(e.target.dataset.mesa);
    });
  });

  // Inicializar el gráfico al cargar la página
  actualizarGrafico();
});

