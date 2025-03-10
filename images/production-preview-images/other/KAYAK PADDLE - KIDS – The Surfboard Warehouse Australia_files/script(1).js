/* Sample JavaScript file added with ScriptTag resource. 
This sample file is meant to teach best practices.
Your app will load jQuery if it's not defined. 
Your app will load jQuery if jQuery is defined but is too old, e.g. < 1.7. 
Your app does not change the definition of $ or jQuery outside the app. 
Example: if a Shopify theme uses jQuery 1.4.2, both of these statements run in the console will still return '1.4.2'
once the app is installed, even if the app uses jQuery 1.9.1:
jQuery.fn.jquery => "1.4.2" 
$.fn.jquery -> "1.4.2"
*/


/* Using a self-executing anonymous function - (function(){})(); - so that all variables and functions defined within 
aren’t available to the outside world. */

(function () {

    /* Load Script function we may need to load jQuery from the Google's CDN */
    /* That code is world-reknown. */
    /* One source: http://snipplr.com/view/18756/loadscript/ */

    var web_url = 'https://app.gosolucia.com';

    var loadScript = function (url, callback) {

        var script = document.createElement("script");
        script.type = "text/javascript";

        // If the browser is Internet Explorer.
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
            // For any other browser.
        } else {
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);

    };


    function createLocationChangeEvent() {
        history.pushState = (function (f) {
            return function pushState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('pushstate'));
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            }
        })(history.pushState);

        history.replaceState = (function (f) {
            return function replaceState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('replacestate'));
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            }
        })(history.replaceState);

        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event('locationchange'))
        });
    }


    function trackReferral($) {
        console.log('tracking referall')

        var href = window.location.href;

        // Check URL for specified get parameter. Use UTM
        var url = new URL(href);
        var lead_id = url.searchParams.get("utm_campaign");

        var source = url.searchParams.get('utm_source');

        var data = {
            'lead_id': lead_id
        }

        if (lead_id && source === 'notify_back_in_stock') {
            var ajax_url = web_url + "/notifications/api/clicks/";
            $.ajax({
                url: ajax_url,
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
                success: function (settings) {
                    console.log('Click counted')
                },
                error: function (request, error) {
                    console.log('Click NOT counted.')

                }
            })
        }
    }


    function trackPageViews($, product, selectedVariant) {
        var product_link = window.location.host + product.url;
        var data = {
            'external_product_id': selectedVariant.id,
            'store_url': window.Shopify.shop,
            'product_link': product_link
        };

        console.log(data)

        $.ajax({
            url: web_url + "/notifications/api/pageviews/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function (d) {
            },
            error: function (d) {
                console.log('Error: ')
                console.log(d.responseText);
            }
        });
    }


    function addCss($, fileName) {
        var link = $("<link />", {
            rel: "stylesheet",
            type: "text/css",
            href: fileName
        })
        $('head').append(link);
    }


    function submitRequest($, product, selectedVariant, settings) {
        console.log('selected')
        console.log(selectedVariant);
        var contact_info = $("#notifi-contact-info").val();
        var has_subscribed = $("#notifi-subscribe-checkbox").is(':checked');
        var product_link = window.location.host + product.url;
        var language = navigator.language;

        var data = {
            'contact_info': contact_info,
            'has_subscribed': has_subscribed,
            'external_product_id': selectedVariant.id,
            'store_url': window.Shopify.shop,
            'product_link': product_link,
            'language': language,
        };

        $(".notifi-progress").show();

        $.ajax({
            url: web_url + "/notifications/api/notifications/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function (d) {
                $('.notifi-error').hide();
                $(".notifi-progress").hide();
                $('.notifi-success').show();

                $("#notifi-submit-btn").prop('disabled', true);
            },
            error: function (d) {
                console.log(d.responseText);
                $(".notifi-progress").hide();
                $(".notifi-error").text(settings.notify_error_message)
                $('.notifi-error').show();
            }
        });
    }


    function showModal() {
        console.log('show modal')
        var modal = document.getElementById("notifiModal");

        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("notifi-close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }


    function findElementOnProductPage($) {

        var elements = ['form[action="/cart/add"]', '[data-add-to-cart]', '[data-cart-submit]',
            '.add-to-cart-box', 'p.modal_price',
            'form#product-form', '[data-shopify="payment-button"]']

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if ($(el).length) {
                return el
            }
        }
    }


    function getSelectedVariant($, product) {
        if (product.variants.length === 1 && !product.available) {
            selected = product.variants[0];
        }

        else {
            var url = new URL(document.URL);
            var variantId = url.searchParams.get("variant") ?
                url.searchParams.get("variant") : window.ShopifyAnalytics.meta.selectedVariantId;

            var selected = $.grep(product.variants, function (e) { return e.id === parseInt(variantId); })[0];
        }


        if(!selected && !product.available) {
            selected = product.variants[0]
        }

        return selected
    }


    function appendForm($, selectedVariant, settings, product) {
        var el = settings.btn_anchor_tag ? settings.btn_anchor_tag : findElementOnProductPage($);

        if (settings.show_if_any_outofstock) {
            var any_variant_outofstock = product.variants.some(el => el.available === false);
            if (any_variant_outofstock) {
                $(el + ":first").after(settings.html);
                $('body').append(settings.modal);
            }
        }

        else if (selectedVariant) {
            if (!selectedVariant.available) {
                $(el + ":first").after(settings.html);
                $('body').append(settings.modal);
                // trackPageViews($, product, selectedVariant);
            }
        }

        else if (settings.has_sign_up_modal) {
            var any_variant_available = product.variants.some(el => el.available === true);
            if (!any_variant_available) {

                $(el + ":first").after(settings.html);

                $('body').append(settings.modal);

                // TODO: Track page views for modal as well
                //  trackPageViews($, product, selectedVariant);
            }
        }
    }


    function addOptionsToSelect($, product) {
        $('#notifi-variant-selector').empty();
        var available_variants = $.grep(product.variants, function (e) { return e.available === false });

        $.each(available_variants, function (i, item) {
            var title = item.title == "Default Title" ? product.title : item.title;
            $('#notifi-variant-selector').append($('<option>', {
                value: item.id,
                text: title
            }));
        });
    }


    function addWidgetToProductPage($, settings, path) {
        console.log(settings)

        // The pathname most likely looks like /collections/something/products/product-handle
        const productHandle = path.substring(path.lastIndexOf("/") + 1);

        // Get product stock quantity and display
        $.getJSON('/products/' + productHandle + '.js', function (product) {
            var selectedVariant;

            selectedVariant = getSelectedVariant($, product);

            appendForm($, selectedVariant, settings, product);

            window.addEventListener('locationchange', function (e) {
                console.log('location changed2')

                $(".notifi-modal").remove();
                $("#notification-parent").remove();
                $("#notifi-show-modal-btn").remove();

                selectedVariant = getSelectedVariant($, product);

                appendForm($, selectedVariant, settings, product);
            });

            $(document).on('touchstart click', '#notifi-show-modal-btn', function (event) {
                if (event.handled === false) return
                event.stopPropagation();
                event.preventDefault();
                event.handled = true;

                $("#notifi-submit-btn").prop('disabled', false);
                $('.notifi-error').hide();
                $(".notifi-progress").hide();
                $('.notifi-success').hide();

                addOptionsToSelect($, product);

                selectedVariant = getSelectedVariant($, product)

                if (selectedVariant) $('#notifi-variant-selector option[value="' + selectedVariant.id + '"]').prop('selected', true);

                $("#notifi-product-name").text(product.title);

                showModal();

            });

            $(document).on('click', '#notifi-submit-btn', function () {

                if (settings.has_sign_up_modal) {
                    var selectedVariantId = $("#notifi-variant-selector").val();
                    selectedVariant = $.grep(product.variants, function (e) { return e.id === parseInt(selectedVariantId); })[0];
                }

                submitRequest($, product, selectedVariant, settings);
            });
        });
    }


    
    function findElementByText(text) {
        var jSpot = $("*:contains(" + text + ")")
                    .filter(function() { return $(this).children().length === 0;})
    
        return jSpot;
    }


    function addWidgetToCollectionsPage($, settings) {
        console.log('adding to collections')

        var soldOutTags = $('*').filter(function(){ 
            return $(this).text().toLowerCase().replace(/ /g,'') === 'soldout';
        })

        soldOutTags.each(function(e){
            console.log('sold out tags')

            $(this).closest('li').find('a').append(settings.html);
        })

        
        $('body').append(settings.modal);
        var selectedProduct;

        $(document).on('click', '.notifi-show-modal', function (e) {
            // TODO: Potentially use e.preventDefault and stopPropagation here.
            console.log($(this))
            $('.notifi-error').hide();
            $(".notifi-progress").hide();
            $('.notifi-success').hide();

            // Get product handle
            var aTag = $(this).parent().prevAll('a:first');
            console.log(aTag);
            console.log(aTag[0].href)

            // Query ajax API to get product info

            //selectedProduct = $.grep(products, function (e) { return e.handle === productHandle; })[0];

            $("#notifi-submit-btn").prop('disabled', false);

            // Add product information to modal.
            $("#notifi-product-name").text(selectedProduct.title);

            addOptionsToSelect($, selectedProduct);

            showModal();

        });

        $(document).on('click', '#notifi-submit-btn', function () {

            if (settings.has_sign_up_modal) {
                var selectedVariantId = $("#notifi-variant-selector").val();
                selectedVariant = $.grep(selectedProduct.variants, function (e) { return e.id === parseInt(selectedVariantId); })[0];
            }

            submitRequest($, selectedProduct, selectedVariant, settings);
        });
    }


    function activateScript($, settings) {

        // TODO: Could move this to run after widget has been rendered.
        createLocationChangeEvent();

        addCss($, 'https://solucia.s3.us-east-2.amazonaws.com/plugin_styles.css')

        // $ in this scope references the jQuery object we'll use.
        // Don't use jQuery, or jQuery191, use the dollar sign.
        // Do this and do that, using $.

        // Get product handle from url
        const path = window.location.pathname;

        if (settings.show_on_collections_page &&
            path.indexOf('collections') >= 0 &&
            path.indexOf('products') <= 0) {

            addWidgetToCollectionsPage($, settings);
        }

        else if (path.indexOf('products') >= 0) {
            addWidgetToProductPage($, settings, path);
        }
        trackReferral($);
    }


    /* This is my app's JavaScript */
    var myAppJavaScript = function ($) {
        console.log('Notifi: Back in Stock Alerts');
        const path = window.location.pathname;

        if (path.indexOf("products") >= 0 || path.indexOf('collections') >= 0) {

            var shop_url = window.Shopify.shop;

            var url = web_url + "/notifications/api/store_settings/get_settings_by_url/";
            $.ajax({
                url: url,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {
                    'shop_url': shop_url
                },
                success: function (settings) {
                    if (settings.is_enabled) {
                        activateScript($, settings);
                    }
                },
                error: function (request, error) {
                    console.log('There was an error retrieving the settings.')

                }
            })
        }
    };






    /* If jQuery has not yet been loaded or if it has but it's too old for our needs,
    we will load jQuery from the Google CDN, and when it's fully loaded, we will run
    our app's JavaScript. Set your own limits here, the sample's code below uses 1.7
    as the minimum version we are ready to use, and if the jQuery is older, we load 1.9. */
    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.9)) {
        loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function () {
            jQuery191 = jQuery.noConflict(true);
            myAppJavaScript(jQuery191);

        });
    } else {
        myAppJavaScript(jQuery);

    }

})();



        // $.getJSON('/collections/all/products.json?page=1', function (response) {
        //     console.log(response)

        // })

        // $.getJSON('/collections/all/products.json?page=2', function (response) {
        //     console.log(response)

        // })

        // $.getJSON('/products.json', function (response) {
        //     console.log(response)

        // })

    // function getProductHandles() {
    //     var productHandles = [];
    //     $("li a").each(function () {
    //         var href = $(this)[0].href
    //        if (href.indexOf("products") >= 0) {
    //            var productHandle = href.split("products/").pop();
    //            productHandles.push(productHandle);
    //        }
    //     });
    //     return productHandles
    // }


          // $.getJSON('/collections/all/products.json', function (response) {
        //     $('body').append(settings.modal);
        //     console.log(response);
        //     var products = response.products;

        //     var unavailableProducts = [];
        //     for (var i = 0; i < products.length; i++) {
        //         var item = products[i];

        //         var a = item.variants.some(el => el.available === true);

        //         if (!a) {
        //             unavailableProducts.push(item);

        //             var html = settings.html;

        //             var selector = "a[href='/collections/all/products/" + item.handle + "']";

        //             $(selector).parent().parent().append(html);

        //             $(selector).data('productHandle', item.handle);
        //         }
        //     }



        // var allTags = [];
        // var pTags = document.getElementsByTagName("p");
        // console.log(pTags)
        // var spanTags = document.getElementsByTagName("span");
        // allTags = allTags.concat(pTags)
        // allTags = allTags.concat(spanTags)
        // console.log(allTags)

        // var searchText = "soldout";
        // var found;

        // for (var i = 0; i < allTags.length; i++) {
        //     var innerText = allTags[i].innerText.toLowerCase().replaceAll(/\s/g, '');
        //     if (innerText == searchText) {
        //         var html = settings.html;
        //         console.log('in if statement')
        //         found = allTags[i];
        //         found.parentElement.parentElement.insertAdjacentHTML('afterend', html);
        //     }
        // }
