prison.collision = (function () {
    var Cax,     //center Coordinate of rectangle A
        Cay,     //center Coordinate of rectangle A
        Ax,     //unit vector representing the local x-axis of A
        Ay,     //unit vector representing the local y-axis of A
        HwA,    //half width of A (corresponds with the local x-axis of A)
        HhA,    //half height of A (corresponds with the local y-axis of A)


        Cbx,
        Cby,
        Bx,
        By,
        HwB,
        HhB
    

    function collisionCheck(A,B)
    {
        var A = new Victor(A.X, A.Y);
        var B = new Victor(B.X, B.Y);


    }





    return {
        collisionCheck: collisionCheck
    };
})();