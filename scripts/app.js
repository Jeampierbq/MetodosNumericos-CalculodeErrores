import Process from "./process.js";

class App {
  constructor() {
    //Variable de la funcion
    this._method = "-1";

    //Iniciando varibales del menu
    this._enlaces = $("#enlaces");
    this._btnMenu = $("#btn-menu");
    this._metodos = $(".metodos");
    this._icono = $("#btn-menu .icono");

    //Agregndo variables de la pantalla
    this._ancho = $(window).width();
    if (this._ancho < 855) {
      this._metodos.hide();
      this._enlaces.hide();
      this._icono.addClass("fa-bars");
    }

    //Iniciando los esuchcadores de evento
    this._LoadListeners();
  }

  //Este metodo permite mostrar/ocultar el nav del menu
  _toggleMenu = () => {
    if ($(window).width() <= 855) {
      this._enlaces.slideToggle();
      this._metodos.slideToggle();
      this._icono.toggleClass("fa-bars");
      this._icono.toggleClass("fa-times");
    }
  };

  //Metodo que inicia los escuchadores de evento
  _LoadListeners() {
    $(window).on("resize", () => {
      if ($(window).width() > 855) {
        this._enlaces.show();
        this._metodos.show();
        this._icono.addClass("fa-times");
        this._icono.removeClass("fa-bars");
      } else {
        this._enlaces.hide();
        this._metodos.hide();
        this._icono.addClass("fa-bars");
        this._icono.removeClass("fa-times");
      }
    });

    $(this._btnMenu).on("click", this._toggleMenu);

    $("#noEsperado").on("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: '¿No se muestra como esperabas?',
        text: 'Intenta encerrar la parte de la formula entre llaves. Ej: "{-x}"',
        imageUrl: '/res/img/malaFormula.png',
        imageWidth: 800,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })
    });

    $("#methods").on("change", () => {
      let op = $("#methods").val();
      this._method = op;
      if (op != -1 && this._ancho < 855) {
        this._toggleMenu();
      }
    });

    $("#inpRange").on("input", (e) => {
      $("#lblRange").html(e.target.value);
    });

    $("#tipoCalc").on("change", () => {
      let op = $("#tipoCalc").val();
      $("#lblTolerancia").hide();
      if (op == "1") {
        $("#lblTolerancia").html("Tolerancia deseada");
        $("#lblTolerancia").fadeIn(400);
        $("#inpTolerancia").attr("placeholder", "Ejemplo: 0.0001");
      } else {
        $("#lblTolerancia").html("No. Iteraciones");
        $("#lblTolerancia").fadeIn(400);
        $("#inpTolerancia").attr("placeholder", "Ejemplo: 4");
      }
    });

    $("#btnCalc").on("click", this._startProcess);
    $("#btnReset").on("click", () => {
      $("#r-container").fadeOut();
      $("form").trigger("reset");
    });

    $("#showSteps").on("click", (e) => {
      Swal.fire(
        "¡Aviso!",
        "Esta función no esta disponible por el momento",
        "info"
      );
    });
  }

  //Este metodo permite empezar los calculos
  _startProcess = () => {
    $("#math-preview").html("$$" + $("#inpFuncion").val() + "$$");
    MathJax.typesetPromise();
    let pc = Process.getProcess();
    let porcentaje = 0;


    if (this._method == "-1" ) {
      Swal.fire("ERROR", `Debe seleccionar un método!`, "error");
      return;
    }


    if (pc === false) {
      Swal.fire("ERROR", `Faltan campos por rellenar!`, "error");
      return;
    }


    pc.setMethod(this._method);
    if (pc.startProcess() === false) {
      Swal.fire("ERROR", `Debe seleccionar un método!`, "error");
      return;
    }


    $("#r-container").fadeIn();
    window.scrollBy(0, $("#r-container").offset().top);
  };
}


new App();

$(function () {
  $(".article-header-collapse").on("click", function (e) {
    e.preventDefault();
    let art_inf = $(this).parent().parent().find(".article-info").last();
    art_inf.slideToggle();
  });
});










