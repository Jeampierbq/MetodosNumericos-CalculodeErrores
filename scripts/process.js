export default class Process {
  constructor(func, inpX0, inpX1, inpTolerancia, inpRange, tCalc) {
    this._inpX0 = inpX0;
    this._inpX1 = inpX1;
    this._inpTolerancia = Number(inpTolerancia);
    this._inpRange = inpRange;
    this._tCalc = tCalc;

    this._lastMethod = "";
    this._func = func;
    this._method = "-1";
    this._lastXr = [];

    this._Raiz = 0;

    this._Xr = 0;
    this._FXr = 0;
    this._FX0 = 0;
    this._FX1 = 0;
    this._Ea = 100;

    this._table = $("#tableBody");
  }

  showResults(I, X0, FX0, X1, FX1, Xr, FXr, Ea) {
    $(this._table).append(
      `<tr><td>${I}</td><td>${X0}</td><td>${FX0}</td><td>${X1}</td><td>${FX1}</td><td>${Xr}</td><td>${FXr}</td><td>${Ea}</td></tr>`
    );
  }

  _roundFixed(num, dec) {
    let exp = Math.pow(10, dec || 2); // 2 decimales por defecto
    return parseInt(num * exp, 10) / exp;
  }

  getInpX0() {
    return this._inpX0;
  }

  getInpX1() {
    return this._inpX1;
  }

  getInpTolerancia() {
    return this._inpTolerancia;
  }

  getInpRange() {
    return this._inpRange;
  }

  getTCalc() {
    return this._tCalc;
  }

  getLastMethod() {
    return this._lastMethod;
  }

  //Esta método de clase permite calcular la aprox de una raiz utilizando
  //METODOD BISECCION
  calcBisection() {
    // Comprobamos que el rango es válido
    if (!(this._inpX0 * this._inpX1 < 0)) {
      // Declaramos la variable de iteración
      let i = 0;

      // Empezamos el bucle
      do {
        // Paso 0: Verificar tolerancia
        if (this._tCalc == 1) {
          if (this._Ea <= this._inpTolerancia) break;
        } else {
          if (i >= this._inpTolerancia) break;
        }

        // Paso 1: Evaluar F(x) de XL y Xu
        this._FX0 = this._roundFixed(
          this.evalFunction(this._inpX0),
          this._inpRange
        );
        this._FX1 = this._roundFixed(
          this.evalFunction(this._inpX1),
          this._inpRange
        );
        // Paso 2: Calcular el valor de Xr
        this._Xr = this._roundFixed(
          (this._inpX1 + this._inpX0) / 2,
          this._inpRange
        );
        // Paso 3: Guardar el valor de Xr
        this._lastXr.push(this._Xr);
        // Paso 4: Evaluar F(x) de Xr
        this._FXr = this._roundFixed(
          this.evalFunction(this._Xr),
          this._inpRange
        );
        // Paso 5: Calcular el Error Absoluto (Ea)
        if (this._lastXr.length > 1) {
          this._Ea = this._roundFixed(
            Math.abs(this._Xr - this._lastXr[i - 1]),
            this._inpRange
          );
        } else {
          this._Ea = "---";
        }
        // Paso 6: Mostrar resultados en tabla
        this.showResults(
          i + 1,
          this._inpX0,
          this._FX0,
          this._inpX1,
          this._FX1,
          this._Xr,
          this._FXr,
          this._Ea
        );

        // Paso 7: Condicional de cambio
        if (this._FX0 * this._FXr < 0) this._inpX1 = this._Xr;
        else if (this._FX0 * this._FXr > 0) this._inpX0 = this._Xr;
        else {
          this._Raiz = this._Xr;
          break;
        }

        // Pasamos a la siguiente iteración
        i++;
      } while (1);

      this._lastXr.splice(0);
    } else {
      Swal.fire(
        "ERROR",
        `No se puede sacar raíz con estos intervalos!`,
        "error"
      );
    }
  }


  //Esta método de clase permite calcular la aprox de una raiz utilizando
  //METODO DE FALSA POSICION 

  // Método de falsa posición
  calcFakeRule() {
    //Comprobamos que el rango es valido
    if (!(this._inpX0 * this._inpX1 < 0)) {
      //Declaramos la variable de iteración
      let i = 0;

      //Empezamos el bucle
      do {
        //Paso 0: Verificamos tolerancia
        if (this._tCalc == 1) {
          if (this._Ea <= this._inpTolerancia) break;
        } else {
          if (i >= this._inpTolerancia) break;
        }

        //Paso 1: Evaluar F(x) de XL y Xu
        this._FX0 = this._roundFixed(
          this.evalFunction(this._inpX0),
          this._inpRange
        );
        this._FX1 = this._roundFixed(
          this.evalFunction(this._inpX1),
          this._inpRange
        );
        //Paso 2: Calcular el valor de Xr
        this._Xr = this._roundFixed(
          this._inpX1 -
          (this._FX1 * (this._inpX0 - this._inpX1)) / (this._FX0 - this._FX1),
          this._inpRange
        );
        //Paso 3: Guardar el valor de Xr
        this._lastXr.push(this._Xr);
        //Paso 4: Evaluar F(x) de Xr
        this._FXr = this._roundFixed(
          this.evalFunction(this._Xr),
          this._inpRange
        );
        //Paso 5: Calcular el Error Absoluto (Ea para los amigos)
        if (this._lastXr.length > 1)
          this._Ea = this._roundFixed(
            Math.abs(((this._Xr - this._lastXr[i - 1]) / this._Xr) * 100),
            this._inpRange
          );
        else this._Ea = "---";

        //Paso 7: Mostrar resultados en tabla
        this.showResults(
          i + 1,
          this._inpX0,
          this._FX0,
          this._inpX1,
          this._FX1,
          this._Xr,
          this._FXr,
          this._Ea // Mostrar el error absoluto en decimales
        );

        //Paso 6: Condicional de cambio
        if (this._FX0 * this._FXr < 0) this._inpX1 = this._Xr;
        else if (this._FX0 * this._FXr > 0) this._inpX0 = this._Xr;
        else {
          this._Raiz = this._Xr;
          break;
        }



        //Pasamos a la siguiente iteración
        i++;
      } while (1);

      this._lastXr.splice(0);
    } else {
      Swal.fire(
        "ERROR",
        "No se puede sacar raíz con estos intervalos!",
        "error"
      );
    }
  }


  //Esta método de clase permite calcular la aprox de una raiz utilizando
  //METODO SECANTE
  calcSec() {
    //Comprobamos que el rango es valido
    if (!(this._inpX0 * this._inpX1 < 0)) {
      //Declaramos la variable de iteración
      let i = 0;

      //Empezamos el bucle
      do {
        //Paso 0: Verificamos tolerancia
        if (this._tCalc == 1) {
          if (this._Ea <= this._inpTolerancia) break;
        } else {
          if (i >= this._inpTolerancia) break;
        }

        //Paso 1: Evaluar F(x) de XL y Xu
        this._FX0 = this._roundFixed(
          this.evalFunction(this._inpX0),
          this._inpRange
        );
        this._FX1 = this._roundFixed(
          this.evalFunction(this._inpX1),
          this._inpRange
        );
        //Paso 2: Calcular el valor de Xr
        this._Xr = this._roundFixed(
          this._inpX1 -
          (this._FX1 * (this._inpX0 - this._inpX1)) / (this._FX0 - this._FX1),
          this._inpRange
        );
        //Paso 3: Guardar el valor de Xr
        this._lastXr.push(this._Xr);
        //Paso 4: Evaluar F(x) de Xr
        this._FXr = this._roundFixed(
          this.evalFunction(this._Xr),
          this._inpRange
        );
        // Paso 5: Calcular el Error Absoluto (Ea para los amigos)
        if (this._lastXr.length > 1) {
          this._Ea = this._roundFixed(
            Math.abs(this._Xr - this._lastXr[i - 1]),
            this._inpRange
          );
        } else {
          this._Ea = "---";
        }

        //Paso 7: Condicional de cambio
        if (this._FX0 * this._FXr == 0) {
          this._Raiz = this._Xr;
          break;
        }

        //Paso 6: Mostrar resultados en tabla
        this.showResults(
          i + 1,
          this._inpX0,
          this._FX0,
          this._inpX1,
          this._FX1,
          this._Xr,
          this._FXr,
          this._Ea // Elimina el + "%"
        );
        ;

        //Paso 8: Cambiamos los valores siguientes
        this._inpX0 = this._inpX1;
        this._inpX1 = this._Xr;

        //Pasamos a la siguiente iteración
        i++;
      } while (1);

      this._lastXr.splice(0);
    } else {
      Swal.fire(
        "ERROR",
        `No se puede sacar raíz con estos intervalos!`,
        "error"
      );
    }
  }

  //Esta método de clase permite calcular la aprox de una raiz utilizando


  //Metodo de Newton
  calcNewton() {
    let deriv = math.derivative(this._func, "x");
    let i = 0;
    let calcDeriv = 0;
    let prevX0 = this._inpX0; // Almacenar el valor anterior de X0
    do {
      this._FX0 = this._roundFixed(
        this.evalFunction(this._inpX0),
        this._inpRange
      );
      calcDeriv = this._roundFixed(
        deriv.evaluate({ x: this._inpX0 }),
        this._inpRange
      );
      console.log("Derivada: " + calcDeriv);
      this._Xr = this._roundFixed(
        this._inpX0 - this._FX0 / calcDeriv,
        this._inpRange
      );
      this._lastXr.push(this._Xr);
      if (this._lastXr.length > 1) {
        // Calcular el error absoluto como la diferencia entre las filas de "X0"
        this._Ea = this._roundFixed(
          Math.abs(this._inpX0 - prevX0),
          this._inpRange
        );
      } else {
        this._Ea = "---";
      }
      this.showResults(
        i + 1,
        this._inpX0,
        this._FX0,
        "-",
        "-",
        this._Xr,
        "-",
        this._Ea
      );
      prevX0 = this._inpX0; // Actualizar el valor anterior de X0
      if (this._tCalc == 1) {
        if (typeof this._Ea == "number") {
          if (this._Ea <= this._inpTolerancia) break;
        }
      } else {
        if (i >= this._inpTolerancia) {
          break;
        }
      }
      this._inpX0 = this._Xr;
      i++;
    } while (1);

    //xi+1 = xi - (fxi / fxd)

    // fx=x^3-x +1, x0=-1 fxd=3x^2-1
    // xi+1=xi-x3-x+1/3x2-1
  }

  setFunc(func) {
    this._func = func;
  }

  getFunc() {
    return this._func;
  }

  setMethod(method) {
    this._method = method;
  }

  setTCalc(tCalc) {
    this._tCalc = tCalc;
  }

  getMethod() {
    return this._method;
  }

  startProcess() {
    $("#tableBody tr").remove();

    switch (this._method) {
      case "1":
        this.calcBisection();
        break;
      case "2":
        this.calcFakeRule();
        break;
      case "3":
        this.calcSec();
        break;
      case "4":
        this.calcNewton();
        break;
      case "5":
        this.calcPuntoFijo();
        break
      default:
        return false;
        break;
    }
  }

  //Este metodo permite evaluar una funcion y regresa el resultado numerico
  evalFunction(value) {
    let f = this._func;
    f = f.replaceAll("x", `(${value})`);
    return Number(math.evaluate(f).toString());
  }

  static _normalizeFunc(func) {
    func = func.toLowerCase();
    func = func.replaceAll("=0", "");
    func = func.replaceAll(" ", "");
    func = func.replaceAll("sen", "sin");
    func = func.replaceAll("{", "");
    func = func.replaceAll("}", "");

    return func;
  }

  //Estemetodo permite obtener los valores del DOM y crear un objeto Process
  static getProcess() {
    let func = $("#inpFuncion").val();
    func = this._normalizeFunc(func);
    let inpX0 = Number($("#inpX0").val());
    let inpX1 = Number($("#inpX1").val());
    let inpTolerancia = $("#inpTolerancia").val();
    let inpRange = Number($("#inpRange").val());
    let tCalc = $("#tipoCalc").val();

    if (document.querySelector("#form").checkValidity()) {
      return new Process(func, inpX0, inpX1, inpTolerancia, inpRange, tCalc);
    }

    return false;
  }

  // Método de Punto Fijo
  calcPuntoFijo() {
    if (!(this._inpX0 * this._inpX1 < 0)) {
      console.log("Error: X0 y X1 deben tener signos opuestos para el Método de Punto Fijo.");
      return;
    } else {
      let i = 0;
      let x0 = parseFloat(this._inpX0); // Valor inicial X0 (capturado desde el campo de entrada)
      let tol = parseFloat(this._inpTolerancia); // Tolerancia deseada (capturada desde el campo de entrada)
      let maxIter = this._tCalc === "2" ? parseFloat(this._inpTolerancia) : 100; // Número máximo de iteraciones o un valor alto por defecto

      do {
        let x1 = this.calculateNextValue(x0); // Calcula el siguiente valor usando la función de iteración
        let error = Math.abs(x1 - x0); // Calcula el error absoluto

        this.showResults(i + 1, x0, this.evalFunction(x0), x1, this.evalFunction(x1), x1, error);

        x0 = x1;

        i++;
      } while (error > tol && i < maxIter);
    }
  }

}


