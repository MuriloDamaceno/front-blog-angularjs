angular.module('blog', []);

angular.module('blog').controller('Rest', function ($scope, $http) {
  $http.get('https://api-fake-blog-1.onrender.com/postagens')
    .then(function(response) {
        $scope.publicacoes = response.data; 
    })
    .catch(function(error) {
        console.error("Erro ao carregar postagens:", error);
    });
});
