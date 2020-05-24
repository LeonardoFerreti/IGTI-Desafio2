var allPersons = [];
var labelResultUsuarios = null;
var tabUsuarios = null;
var labelResultEstatisticas = null;
var tabEstatisticas = null;
var inputBusca = null;
var btnBusca = null;

// Evento load da página, carrego os componentes com o querySelector e chamo as funções de habilitar/desabilitar botao de procura, adicionar a consulta ao click do botao consultar, e carregar a lista com todas as pessoas do json
window.addEventListener('load', () => {
  labelResultUsuarios = document.querySelector('#labelResultUsuarios');
  tabUsuarios = document.querySelector('#tabUsuarios');
  labelResultEstatisticas = document.querySelector('#labelResultEstatisticas');
  tabEstatisticas = document.querySelector('#tabEstatisticas');
  btnBusca = document.querySelector('#btnBusca');
  inputBusca = document.querySelector('#txtBusca');

  doEnableDisableSearch();
  doSearchPersons();
  fetchPersons();
});

//habiita/desabilita o botão de procurar de acordo com a tecla pressionada no input
function doEnableDisableSearch() {
  inputBusca.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchFilteredPersons();
    }
  });

  inputBusca.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    } else {
      if (this.value.length > 0) {
        btnBusca.classList.remove('disabled');
      } else {
        btnBusca.classList.add('disabled');
      }
    }
  });
}

//ação de clicar no botao procurar: consulta no json carregado as pessoas
function doSearchPersons() {
  btnBusca.addEventListener('click', function () {
    searchFilteredPersons();
  });
}

//filtra as pessoas pelo o que está digitado no input e ordena por ordem alfabética de nome
function searchFilteredPersons() {
  if (inputBusca.value.length > 0) {
    var listSearchPersons = allPersons.filter(function (person) {
      return person.name.toLowerCase().includes(inputBusca.value.toLowerCase());
    });
    render(listSearchPersons.sort((a, b) => a.name.localeCompare(b.name)));
  } else {
    resetInfo();
  }
}

//consulta o json de pessoas na api usando o async/await fetch
//prettier-ignore
async function fetchPersons() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo' );
  const json = await res.json();
  allPersons = json.results.map((person) => {
    const { name, picture, dob, gender } = person;
    return {
      name: name.first + ' ' + person.name.last,
      picture: picture.thumbnail,
      age: dob.age,
      gender,
    };
  }); 
}

//renderiza o json no resultado da consulta
function render(listPersons) {
  renderPersonList(listPersons);
  renderStatisticList(listPersons);
}

//renderiza a informação de pessoas
function renderPersonList(listPersons) {
  let personsHTML = '<div>';

  listPersons.forEach((person) => {
    const { name, picture, age, gender } = person;
    const personHTML = `<div class ='person'>
    <div><img src="${picture}" alt="${name}"<div>
     <span class="personInfo">${name}, ${age} anos </span>
    </div>`;
    personsHTML += personHTML;
  });

  labelResultUsuarios.innerHTML =
    listPersons.length + ' usuário(s) encontrado(s)';
  tabUsuarios.innerHTML = personsHTML;
}

//renderiza as estatisticas
function renderStatisticList(listPersons) {
  var listGenderMale = null;
  listGenderMale = listPersons.filter(function (person) {
    return person.gender === 'male';
  });

  const listGenderFemale = listPersons.filter(function (person) {
    return person.gender === 'female';
  });

  const sumAge = listPersons.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const contGenderMale = listGenderMale.length;
  const contGenderFemale = listGenderFemale.length;

  const averageAge = parseFloat(sumAge / listPersons.length).toFixed(2);

  const personstatisticHTML = `<div>
    <ul>
    <li>Sexo masculino: <span class='resultStatistic'>${contGenderMale}</span></li>
    <li>Sexo feminino: <span class='resultStatistic'>${contGenderFemale}</span></li>
    <li>Soma das idades: <span class='resultStatistic'>${sumAge}</span></li>
    <li>Média das idades: <span class='resultStatistic'>${averageAge}</span></li>
    </ul>
  `;
  labelResultEstatisticas.innerHTML = 'Estatísticas';
  tabEstatisticas.innerHTML = personstatisticHTML;
}

//reseta as informações da tela
function resetInfo() {
  labelResultUsuarios.innerHTML =
    listPersons.length + 'Nenhum usuário filtrado';
  tabUsuarios.innerHTML = '';
  labelResultEstatisticas.innerHTML = 'Nada a ser exibido';
  tabEstatisticas.innerHTML = '';
}
