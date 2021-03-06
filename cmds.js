
const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');

exports.helpCmd = rl => {
    log("Comandos:");
    log("  h|help - Muestra esta ayuda");
    log("  list - Listar los quizzes existentes");
    log("  show<id> - Muestra la pregunta y la respuesta del quiz indicado");
    log("  add - Añadir un nuevo quiz interactivamente");
    log("  delete <id> - borra el quiz indicado");
    log("  edit <id> - editar el quiz indicado");
    log("  test <id> - probar el quiz indicado");
    log("  p|play - jugar a preguntar aleatoriamente todos los quizzes");
    log("  credits - créditos");
    log("  q|quit - salir del programa");
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
};

exports.addCmd = rl => {

    rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize( 'Introduzca la respuesta:', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize('se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });

};

exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
       log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};

exports.showCmd = (rl,id) => {

    if (typeof id === "undefined"){
        errorlog('Falta el parametro id');
    }else{
        try{
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        }catch(error){
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.testCmd = (rl,id) => {
    if (typeof id === "undefined"){
        errorlog('Falta el parametro id');
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            rl.question(quiz.question+"?"+" ", answer => {
                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    log(`correcto`);
                    rl.prompt();
                 }
                else{
                    log(`incorrecto`);
                    rl.prompt();
                }
            });
        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.playCmd = rl => {

    let score = 0;

    let toBeResolved = new Array();
    let i=0;
    for(i ; i<model.count(); i++){
       toBeResolved[i]=i;
    }

    const playOne = () => {
        if (toBeResolved.length <= 0) {
            log(`no hay mas preguntas`);
            log(`${score}`);
            rl.prompt();
        } else {
            let id = Math.floor(Math.random() * toBeResolved.length);
            let quiz = model.getByIndex(toBeResolved[id]);
            toBeResolved.splice(id,1);

            rl.question(quiz.question+"?"+" ", answer => {
                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    log(`correcto`);
                    score++;
                    log(`${score}`);
                    playOne();
                }
                else{
                    log(`incorrecto`);
                    log(`${score}`);
                    log(`fin`);
                    rl.prompt();
                }
            });


        }
    };

    playOne();
};

exports.deleteCmd = (rl,id) => {

    if (typeof id === "undefined"){
        errorlog('Falta el parametro id');
    }else{
        try{
            model.deleteByIndex(id);
        }catch(error){
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.editCmd = (rl,id) => {

    if (typeof id === "undefined"){
        errorlog('Falta el parametro id');
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            rl.question(colorize('Introduzca una pregunta:', 'red'), question =>{
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
                rl.question(colorize('Introduzca la respuesta:','red'), answer =>{
                   model.update(id, question,answer);
                   log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                   rl.prompt();
                });
            });
        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }

};

exports.creditsCmd = rl => {
    log('Autores de la práctica');
    log('Maria del Pilar Delgado Pardo', 'green');
    rl.prompt();
};