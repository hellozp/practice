$(function () {

    /*
     * 回到顶部
     */
    (function () {
        var top = $('#goTop');
        top.hide();
        $(window).scroll(throttle(function () {
            if ($(this).scrollTop() <= 10) {
                top.fadeOut(500);
            } else {
                top.fadeIn(500);
            }
        }));
        top.click(function () {
            if ($(window).scrollTop() <= 10) {
                return false;
            }
            $("body,html").animate({
                scrollTop: 0
            }, 200);
            return false;
        });
    })();


    /**
     * ajax的基本设置
     */
    $.ajaxSetup({
        beforeSend: function () {
            $('body').append('<div class="spinner"></div>');
        },
        complete: function () {
            setTimeout(function () {
                $('.spinner').remove();
            }, 500);
        }
    });
});

var app = angular.module('shopCart', []);

app.controller('shopCartController', function ($scope, $http) {
    $scope.recommendList = [];
    $scope.shopCart = [];
    $scope.selectText = '全部商品';
    $scope.selected = ['selected'];
    $http.get('/queryData').success(function (data) {
        $scope.shopCart = data.shopCart;
        $scope.recommendList = data.recommendList;
        $scope.isShow = false;
    });

    $scope.queryShopCart = function (type, text) {
        $scope.isShow = false;
        $scope.selectText = text;

        var arr = new Array(type + 1);
        arr[type] = 'selected';
        $scope.selected = arr;

        $http.get('/queryShopCart', {params: {type: type}}).success(function (data) {
            $scope.shopCart = data;
        });
    }
});
