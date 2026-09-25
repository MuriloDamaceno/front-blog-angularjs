angular.module('blog', [])
  .controller('BlogController', function ($scope, $http, $window) {
    var api = 'https://api-fake-blog-xlic.onrender.com';

    $scope.publicacoes = [];
    $scope.categorias = [];
    $scope.pagina = 'inicio';
    $scope.carregando = false;
    $scope.erro = '';
    $scope.mensagem = '';
    $scope.novaCategoria = {};

    function atualizarPagina() {
      var hash = $window.location.hash.replace('#/', '').replace('#', '');
      var partes = hash.split('/');

      if (!hash || hash === 'inicio') {
        $scope.pagina = 'inicio';
        carregarPostagens();
      } else if (partes[0] === 'postagem' && partes[1]) {
        $scope.pagina = 'detalhe';
        carregarPostagem(partes[1]);
      } else if (partes[0] === 'editar' && partes[1]) {
        $scope.pagina = 'editar';
        carregarPostagem(partes[1]);
        $scope.$watch('postagem', function (postagem) {
          if (postagem) $scope.formulario = angular.copy(postagem);
        });
      } else if (hash === 'categorias') {
        $scope.pagina = 'categorias';
        carregarCategorias();
      } else if (hash === 'nova-categoria') {
        $scope.pagina = 'nova-categoria';
        $scope.erro = '';
      } else {
        $scope.pagina = 'inicio';
        carregarPostagens();
      }
    }

    function carregarPostagens() {
      $scope.carregando = true;
      $scope.erro = '';
      $http.get(api + '/postagens').then(function (response) {
        $scope.publicacoes = response.data;
      }).catch(mostrarErro).finally(function () {
        $scope.carregando = false;
      });
    }

    function carregarCategorias() {
      $scope.carregando = true;
      $scope.erro = '';
      $http.get(api + '/categorias').then(function (response) {
        $scope.categorias = response.data;
      }).catch(mostrarErro).finally(function () {
        $scope.carregando = false;
      });
    }

    function carregarPostagem(id) {
      $scope.carregando = true;
      $scope.erro = '';
      $http.get(api + '/postagem/' + id).then(function (response) {
        $scope.postagem = response.data;
      }).catch(mostrarErro).finally(function () {
        $scope.carregando = false;
      });
    }

    function mostrarErro(error) {
      $scope.erro = error.data && error.data.erro ? error.data.erro : 'Não foi possível carregar os dados.';
    }

    $scope.editar = function (postagem) {
      $scope.formulario = angular.copy(postagem);
      $scope.pagina = 'editar';
      $window.location.hash = '/editar/' + postagem.id;
    };

    $scope.salvarEdicao = function () {
      $scope.carregando = true;
      $scope.erro = '';
      $http.put(api + '/postagem/' + $scope.formulario.id, $scope.formulario).then(function (response) {
        $scope.postagem = response.data;
        $scope.mensagem = 'Postagem atualizada com sucesso.';
        $scope.pagina = 'detalhe';
        $window.location.hash = '/postagem/' + response.data.id;
      }).catch(mostrarErro).finally(function () {
        $scope.carregando = false;
      });
    };

    $scope.salvarCategoria = function () {
      if (!$scope.novaCategoria.nome) {
        $scope.erro = 'Informe o nome da categoria.';
        return;
      }
      $scope.carregando = true;
      $scope.erro = '';
      $http.post(api + '/categorias', $scope.novaCategoria).then(function () {
        $scope.mensagem = 'Categoria criada com sucesso.';
        $scope.novaCategoria = {};
        $window.location.hash = '/categorias';
      }).catch(mostrarErro).finally(function () {
        $scope.carregando = false;
      });
    };

    $window.addEventListener('hashchange', function () {
      $scope.$apply(atualizarPagina);
    });
    atualizarPagina();
  });