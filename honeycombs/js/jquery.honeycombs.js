(function($) {

    $.fn.honeycombs = function(options) {

        // Establish our default settings
        var settings = $.extend({
            combWidth: 250,
            margin: 0,
        }, options);

        function initialise(element) {
            
            $(element).addClass('honeycombs-wrapper');
            
            var width = 0;
            var newWidth = 0;
            var combWidth = 0;
            var combHeight = 0;
            var $wrapper = $(element).find('.honeycombs-inner-wrapper');
            $('.icon-hex-lg').css('font-size',settings.combWidth);
            
            /**
             * Update all scale values
             */
            function updateScales(){
                combWidth = settings.combWidth;
                combHeight = combWidth;
                $(element).find('.comb').width(combWidth).height(combHeight);
                $(element).find('.icon-hex-lg').css('font-size', combWidth);
            }
            
            /**
             * update css classes
             */
            function reorder(animate){
                
                updateScales();
                width = $(element).width();
                
                newWidth = $('.honeycombs').parent().width();
                
                
                if(newWidth < width){
                    width = newWidth;
                }
                
                $wrapper.width(newWidth);

                var maxLeft = 0;
                var row = 0; // current row
                var offset = 0; // 1 is down
                var left = 1; // pos left
                var top = 0; // pos top
//                var cols = 0;

                var noOffset = function(offset){
                    return offset;
                };

                var withOffset = function(offset){
                    return (offset + 1) % 2;
                };

                var halfTop = function(top){
                    return ( row * ( 0.5 * combHeight * Math.sqrt(3) + settings.margin) );
                };

                var fullTop = function(top){
                    return ( row * (combHeight + settings.margin + combHeight * 0.1));
                };
                
                var mapArrayFromCenter = function(itemsAmount, arrayLen){
                    var mapping = [];
                    for(var i = 0;  i < arrayLen; i++){
                        mapping[i] = false ;
                    }
                    
                    if(arrayLen % 2 === 1){
                        var centerIndex = Math.floor(arrayLen / 2);
                        var currentIndex = 0;
                        var deltaIndex = 1;
                        var startIndex = 0;
                        if(itemsAmount % 2 === 1){
                            startIndex = 1;
                            mapping[centerIndex] = true;
                        }
                        for(var i = startIndex;  i < itemsAmount; i++){
                            if(itemsAmount % 2 === 1){
                                currentIndex = i % 2 === 1 ? centerIndex + deltaIndex : centerIndex - deltaIndex++;
                            } else {
                                currentIndex = i % 2 === 0 ? centerIndex + deltaIndex : centerIndex - deltaIndex++;
                            }
                            mapping[currentIndex] = true ;
                        }
                        
                    } else {
                        var centerIndex = Math.floor(arrayLen / 2);
                        for(var i = 0;  i < itemsAmount / 2; i++){
                            mapping[centerIndex + i] = true ;
                            mapping[centerIndex - 1 - i] = true ;
                        }
                    }
                    
                    return mapping;
                };

                function orderCombs(leftHandler, topHandler){
                    var elements = $(element).find('.comb');

                    // расчитать базовое количество элементов в первой строке
                    var firstRowCount = calculateFirstRowCount(left, settings.margin, elements);
                    
                    // расчитываем матрицу положения элементов
                    var positions = calculateMatrix(firstRowCount, elements.length);

                    // оттображаем элементы согласно матрице
                    var elementIndex = 0;
                    for(var i in positions){
                        row = i;
                        for(var j in positions[i]){
                            top = topHandler(top);
                            if(positions[i][j]){
                                var currentElement = elements[elementIndex++];
                                if(animate === true){
                                    $(currentElement).stop(true, false);
                                    $(currentElement).animate({'left': left, 'top': top});
                                }else{
                                    $(currentElement).css('left', left).css('top', top);
                                }
                                // Fix Firefox padding error
                                if (navigator.userAgent.search("Firefox") > -1) { 
                                    $('.comb span').addClass('firefox');
                                }
                            }
                            left = left + ( combWidth + settings.margin );

                            if(left > maxLeft) {
                                maxLeft = left;
                            }
                        }
                        offset = leftHandler(offset);
                        left = offset / 2 * ( combWidth + settings.margin ) ;
                    }
                }

                var calculateFirstRowCount = function(initialLeftPosition, settingsMargin,elements){
                    var columnCounter = 0;
                    var currentLeft = initialLeftPosition;

                    for(var i in elements){
                        columnCounter++;
                        currentLeft = currentLeft + ( combWidth + settingsMargin );
                        if(currentLeft + combWidth > width){
                             break;
                        }
                    }
                    return columnCounter;
                };
                
                var calculateMatrix = function(firstRowCount, elementsCount){
                    var positions = [];
                    var rowIndex = 0;
                    var counter = 0;
                    
                    while(counter < elementsCount){
                        var currentRowCount = rowIndex % 2 === 0 ? firstRowCount : firstRowCount -1;
                        var nearRowCount = rowIndex % 2 === 0 ? firstRowCount - 1 : firstRowCount;
                        currentRowCount = firstRowCount === 1 ? 1 : currentRowCount;
                        var leftItems = elementsCount - counter;
                        counter += currentRowCount;
                        if(leftItems < currentRowCount){
                            // Четная строка и на ней нечетное количество элементов необходимо разбить
                            if( (currentRowCount) % 2 === 0 && (leftItems % 2 === 1) && firstRowCount > 2){
                                // если остался только 1 элемент, то пересобираем матрицу и уменьшаем количество элементов
                                if(leftItems === 1){
                                    positions = calculateMatrix(firstRowCount - 1, elementsCount);
                                } else {
                                    positions.push(mapArrayFromCenter(leftItems - 1, currentRowCount));
                                    positions.push(mapArrayFromCenter(1, nearRowCount));
                                }
                            } else {
                                positions.push(mapArrayFromCenter(leftItems, currentRowCount));
                            }
                            break;
                        } else if(leftItems === currentRowCount){
                            positions.push(addFilledRow(currentRowCount));
                            break;
                        } else {
                            positions.push(addFilledRow(currentRowCount));
                        }
                        rowIndex++;
                    }
                    
                    return positions;
                };

                var addFilledRow = function(count){
                    var result = [];
                    for(var i = 0; i < count; i++){
                        result[i] = true;
                    }
                    return result;
                };
                
                if (newWidth < 1.5 * (combWidth + settings.margin)) {
                    orderCombs(noOffset, fullTop);
                } else {
                    orderCombs(withOffset, halfTop);
                }
                
                $wrapper.height(top + combHeight).width(maxLeft - settings.margin);
            };
            
            $(window).resize(function(){
                reorder(true);
            });
            
            reorder(false);
        }

        return this.each(function() {
            initialise(this);
        });

    };

}(jQuery));
