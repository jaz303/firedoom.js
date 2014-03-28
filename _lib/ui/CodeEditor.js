;(function() {
  
  // TODO: code editor should do batch updates rather than forcing individual changes to be saved
  
  var hk = modulo.get('hk');
  
  var supr = hk.Widget.prototype;
  fd.CodeEditor = hk.Widget.extend(function() {
    
    hk.Widget.apply(this, arguments);
    
    this._engine    = null;
    this._registry  = null;
    this._dirty     = false;
    this._editId    = null;
    
    this._layout();
  
  }, {
    methods: {
      setEngine: function(engine) {
        if (this._engine) {
          this._registry.featuresChanged.disconnect(this);
          this._registry = null;
          this._engine = null;
        }
        
        if (engine) {
          this._engine = engine;
          this._registry = engine.getRegistry();
          this._registry.featuresChanged.connect(this);
        }
        
        this._sync();
      },
      
      dispose: function() {
        this.setEngine(null);
        this._selSwitch = null;
        this._btnUpdate = null;
        this._btnRevert = null;
        this._editor.dispose();
        supr.dispose.call(this);
      },
      
      onFeaturesChanged: function() {
        this._sync();
      },
      
      onContentChanged: function() {
        this._dirty = true;
      },
      
      _buildStructure: function() {
        
        var self = this;
        
        this.root = document.createElement('div');
        this.root.className = 'fd-code-editor';
        
        var select = document.createElement('select');
        
        select.className = 'sel-switch';
        select.addEventListener('change', function() {
          if (!self._tryEditId(select.options[select.selectedIndex].value)) {
            hk.selectOption(select, self._editId);
          }
        });
        
        this.root.appendChild(this._selSwitch = select);
        
        var btn;
        
        btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'btn-update';
        btn.innerText = 'Update';
        
        btn.addEventListener('click', function(evt) {
          evt.preventDefault();
          self._update();
        });
        
        this.root.appendChild(this._btnUpdate = btn);
        
        btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'btn-revert';
        btn.innerText = 'Revert';
        
        btn.addEventListener('click', function(evt) {
          evt.preventDefault();
          self._revert();
        });
        
        this.root.appendChild(this._btnRevert = btn);
        
        this._editor = new hk.CodeEditor();
        this._editor.setChangeTimeout(0);
        this._editor.contentChanged.connect(this);
        
        this._attachChildViaElement(this._editor, this.root);
        
      },
      
      _applyBounds: function() {
        supr._applyBounds.apply(this, arguments);
        this._layout();
      },
      
      _layout: function() {
        this._editor.setBounds(0, 30, this.width, this.height - 30);
      },
      
      _sync: function() {
        
        this._selSwitch.innerHTML = "<option value=''>Select Feature...</option>";
        
        var features = this._registry.getFeatures();
        
        for (var k in features) {
          var group = features[k];
          
          var options = document.createElement('optgroup');
          options.label = fd.featureName(k);
          
          features[k].forEach(function(f) {
            var option = document.createElement('option');
            option.value = k + "." + f.id;
            option.innerText = f.title || f.id;
            options.appendChild(option);
          });
          
          this._selSwitch.appendChild(options);
          
        }
        
      },
      
      _tryEditId: function(id) {
        if (this._dirty && this._editId && !confirm("Discard changes?")) {
          return false;
        }
        
        var source = id ? this._registry.getSourceForFeature(id) : '';
        
        this._editor.muteChangeEvents();
        this._editor.setValue(source);
        this._editor.unmuteChangeEvents();
        
        this._editId = id || null;
        this._dirty = false;
        
        return true;
      },
      
      _update: function() {
        if (!this._editId)
          return;
        
        var result = this._registry.create(this._editId, this._editor.getValue());
        if (!result.success) {
          // TODO: show error
          return;
        }
        
        this._dirty = false;
        
        return;
        
        this._registry.add(result.feature);
        result = this._registry.compile();
        
        if (!result.success) {
          // TODO: show error
        }
      },
      
      _revert: function() {
        if (!this._editId || !this._dirty || !confirm("Are you sure?"))
          return;
          
        this._dirty = false;
        this._tryEditId(this._editId);
      }
    }
  });
  
})();