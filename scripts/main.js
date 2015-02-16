$(function() {
    // given...
    var yourToppings = new ToppingsCollection(),
        defaultToppings = new ToppingsCollection([
            { name: 'Pepperoni' },
            { name: 'Sausage' },
            { name: 'Mozzarella' },
            { name: 'Tomato Sauce' }
        ]);


    // Instructions:
    // You're creating a pizza builder.  Given the necessary
    // models and views, make a pizza builder that suggests
    // the `defaultToppings` listed above, but allows the
    // user to enter any topping they want.
    //
    // When the user selects a topping or presses enter
    // in the field to specify their own, that topping
    // should appear in a list in the div#output.
    // If the user clicks a topping in their list, it
    // should remove that item from their list.

    // YOUR CODE HERE...

});


////////////////////
// models
var ToppingModel = Backbone.Model.extend({
    defaults: {
        name: null
    }
});
var ToppingsCollection = Backbone.Collection.extend({
    model: ToppingModel
});


////////////////////
// views
var SuggestInputView = Backbone.View.extend({
    tagName: 'input',
    attributes: {
        type: 'text'
    },
    events: {
        'focus': 'showList',
        'blur': 'hideList',
        'keyup': 'handleKey'
    },
    initialize: function(options) {
        this.list = new ListCollectionView({
            model: options.suggestions || new Backbone.Collection()
        });
        this.listenTo(this.list, 'selection', function(toppingModel) {
            this.triggerSelection(toppingModel);
        });
    },
    render: function() {
        this.list.render();
        this.list.hide();
        this.$el.after(this.list.$el);
    },
    handleKey: function(ev) {
        // keyCode 13 is enter key
        if (ev.keyCode === 13) {
            this.triggerSelection(
                new ToppingModel({
                    name: this.$el.val()
                })
            );
        }
    },
    showList: function() {
        this.list.show();
    },
    hideList: function() {
        _.delay(
            _.bind(function() {
                this.list.hide();
            }, this)
        , 100);
    },
    triggerSelection: function(toppingModel) {
        this.$el.val('');
        this.trigger('selection', toppingModel);
    }
});


var ListCollectionView = Backbone.View.extend({
    tagName: 'ul',
    className: 'list-collection-view',
    render: function() {
        this.$el.html('');
        this.model.each(_.bind(function(model) {
            var itemView = new ListItemView({
                model: model
            });
            this.listenTo(itemView, 'selection', function(model) {
                this.trigger('selection', model);
            });
            itemView.render();
            itemView.$el.appendTo(this.$el);
        }, this));
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    }
});
var ListItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'list-item-view',
    template: _.template('<a href="#"><%= name %></a>'),
    events: {
        'mousedown a': 'handleClick',
        'click a': false
    },
    render: function() {
        this.$el.html(
            this.template(
                this.model.toJSON()
            )
        );
    },
    handleClick: function(ev) {
        ev.preventDefault();
        this.trigger('selection', this.model);
    }
});