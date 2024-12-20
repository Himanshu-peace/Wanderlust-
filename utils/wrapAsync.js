module.exports = function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);   //this next will call err handler that will send somethig is wrog to the client side
    }
}

// module.exports = (fn) => {
//     return (req,res,next) => {
//         fn(req,res,next).catch(next());
//     }
// }
