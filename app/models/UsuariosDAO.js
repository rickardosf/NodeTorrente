var crypto = require('crypto');
function UsuariosDAO(connection) {
//  console.log('Função Carregou');
this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
  this._connection.open(function(err, mongoclient) {
    mongoclient.collection("usuarios", function(err, collection) {
var senha_criptografia = crypto.createHash("md5").update(usuario.senha).digest("hex");
usuario.senha = senha_criptografia;
      collection.insert(usuario);

      mongoclient.close();
    });
  }

  );
}
UsuariosDAO.prototype.autenticar = function(usuario, req,res){
  this._connection.open(function(err, mongoclient) {
    mongoclient.collection("usuarios", function(err, collection) {
      collection.find(usuario).toArray(function(err,result){
        if(result[0] != undefined){
          req.session.autorizado = true;
        }

        if (req.session.autorizado) {
          //res.send('Usuario encontrado');
          res.redirect('jogo');
        }else{
          //res.send('Usuario nao existe');
          res.render('index', {validacao:{}});
        }
      });

      mongoclient.close();
    });
  }

  );
}

module.exports = function() {
    return UsuariosDAO;
}
