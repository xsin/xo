//plugin base module
XO('plugin',function($,C){
    //插件的公共方法
    var base = function(el, dataset){
        if(el.length && el.length != 0){
            $el = el;
        }else{
            $el = $(el);
        }
        this.$el = $el;
        this.dataset = dataset;
        this['plugin'] = dataset['plugin'];
        this['pluginId'] = dataset['pluginId'];
        this.init($el, dataset);
    }

    base.destroy = function(){
        this.$el.off('touchend');
        this.$el.off('touchstart');
        this.$el.off('touchmove');
        this.$el.off('tab');
        console.log('super destroy!');
    }

    base.init = function(){
        
    }

    base.bootup = function(dataset){

    }

    base.initEvent = function(){

    }

    base.on = function(type, fn, scope){
        var self = this;
        XO.Event.on(this.$el, type + '-' + this.plugin, function(e, scope){
            fn.call(self, scope);
        })
    }
    base.bind = function(){

    }

    base.trigger = function(type, args){
        //this.$el.trigger(type + '-' + this.plugin, args);   
        XO.Event.trigger(this.$el, type + '-' + this.plugin, args);
    }


    var _plugins={};
    var _idx = 0;

    this.get = function(id){
        return _plugins[id];
    }

    this._show = function(){
        console.dir(_plugins);
    }

    this.applyToView = function(view){
        this.applyToElement(view.$el);
    };

    this.applyToElement = function($el){
        var plugin, dataset, p; 
        $el.find('[data-plugin]').each(function(){
            var dataset = this.dataset;
            p_name = dataset['plugin'];
            p = new XO.plugin[p_name](this, dataset);
            p['name'] = p_name;
            if(dataset['pluginId']){
                _plugins[dataset['pluginId']] = p;
            }else{
                _plugins['p_' + _idx] = p;
                _idx++;
            }
        });
    };
    /**
     * 销毁视图内的插件。该方法在视图隐藏后自动调用
     */
    this.destroyInView = function(view){
        //TODO
    };

    this.bootup = function(view, args){
        for(var i in args){
           plugin = this.get(i);
           if(plugin)
                plugin.bootup(args[i]);
        }
    }

    this.define = function(name, prototype){
        prototype = prototype || {};
        var constr = function(){
            base.apply(this, arguments);
            this.super = base;
            this.name = name;
        };
        constr.prototype = (function(){
            var tmp = function(){};
            tmp.prototype = base;
            var proto = new tmp();
            for(var i in prototype){
                proto[i] = prototype[i];
            }
            return proto;
        })();
        XO.plugin[name] = constr;
    };

    this.init = function(){
        //动画结束
        XO.Event.on(XO.EVENT.Animate.End,function(e,data){
            if(data.isHiding){
                //视图隐藏，销毁插件
                XO.plugin.destroyInView(data.view);
            }else{
                //视图显示，初始化插件
                XO.plugin.applyToView(data.view);
                XO.plugin.bootup(data.view,data.view.pluginData);
            }
        });
    };

});

