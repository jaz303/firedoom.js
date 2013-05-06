<!DOCTYPE html>

<html>
  <head>
    <title>Firedoom Demo</title>
    
    <script src='vendor/jquery.min.js'></script>
    
    <? $HUDKIT_BASE = '/vendor/hudkit/'; ?>
    <? require 'vendor/hudkit/tools/hudkit-head.php'; ?>
    
    <script>ACE_NAMESPACE = 'ace';</script>
    <script src='/vendor/hudkit/vendor/ace-builds/src/ace.js'></script>
    <script src='/vendor/hudkit/vendor/ace-builds/src/mode-javascript.js'></script>
    <script src='/vendor/hudkit/vendor/ace-builds/src/theme-cobalt.js'></script>
    <script>delete window.ACE_NAMESPACE;</script>
    
    <script src='vendor/jf-mathkit/lib/mathkit.js'></script>
    
    <script src='lib/firedoom.js'></script>
    
    <script src='lib/Bag.js'></script>
    <script src='lib/math/Vec2.js'></script>
    
    <script src='lib/FieldTypeManager.js'></script>
    <script src='lib/ComponentTypeManager.js'></script>
    <script src='lib/EventManager.js'></script>
    <script src='lib/SystemManager.js'></script>
    <script src='lib/EntityManager.js'></script>
    
    <script src='lib/blueprint/index.js'></script>
    <script src='lib/blueprint/Component.js'></script>
    <script src='lib/blueprint/System.js'></script>
    <script src='lib/blueprint/Event.js'></script>
    <script src='lib/blueprint/EventCategory.js'></script>
    
    <script src='lib/Logger.js'></script>
    <script src='lib/Engine.js'></script>
    <script src='lib/Registry.js'></script>
    <script src='lib/World.js'></script>
    <script src='lib/Compiler.js'></script>
    <script src='lib/Transport.js'></script>
    
<!--     
    <script src='lib/ui/CodeEditor.js'></script>
  -->
    
    <script>
      var env     = null,
          engine  = null,
          world   = null,
          logger  = null;
      
      function engineInitialised(evt) {
        if (!evt.success) {
          logger.error("Initialisation failed");
        } else {
          logger.success("Initialised OK");
          world.getTransport().start();
        }
      }
      
      function createEngine() {
        
        logger = new fd.Logger;
        logger.info('Initialising engine...');
        
        engine = new fd.Engine(logger, env);
        engine.initialised.connect(engineInitialised);
        
        world = engine.getWorld();
      
      }
      
      function loadInitialFeatures() {
        engine.load(fd.SYSTEM, 'physics', 'demo/systems/physics.js');
        engine.load(fd.SYSTEM, 'test', 'demo/systems/test.js');
        engine.load(fd.COMPONENT, 'position', 'demo/components/position.js');
        engine.load(fd.COMPONENT, 'physics', 'demo/components/physics.js');
        engine.load(fd.CATEGORY, 'physics', 'demo/events/physics.js');
        engine.load(fd.EVENT, 'collision', 'demo/events/physics/collision.js');
      }
    
      function init() {
        
        env = {};
        createEngine();
        loadInitialFeatures();
        engine.init();
        
        
        
        
        
        
        
        
        
        
        return;
        
        // //
        // // Hudkit init
        // 
        // var rootPane = hk.init();
        // 
        // var toolbar = new hk.Toolbar();
        // 
        // var split1 = new hk.SplitPane();
        // split1.setSplit(0.4);
        // split1.setOrientation(hk.SPLIT_PANE_HORIZONTAL);
        // 
        // var editor = new fd.CodeEditor();
        // editor.setEngine(engine);
        // 
        // var split2 = new hk.SplitPane();
        // split2.setSplit(0.7);
        // split2.setOrientation(hk.SPLIT_PANE_VERTICAL);
        // 
        // var canvas = new hk.Canvas2D();
        // var terminal = new hk.Console();
        // 
        // // var formatter = modulo.get('ccide/js/consoleFormatter');
        // // this._terminal.setObjectFormatter(formatter);
        // 
        // split2.setTopWidget(canvas);
        // split2.setBottomWidget(terminal);
        // 
        // split1.setLeftWidget(editor);
        // split1.setRightWidget(split2);
        // 
        // rootPane.setToolbar(toolbar);
        // rootPane.setRootWidget(split1);
        // 
        // //
        // // Actions
        // 
        // var actStart = hk.createAction({
        //   enabled: false,
        //   title: "Start",
        //   action: engine.getTransport().method('start')
        // });
        // 
        // var actPause = hk.createAction({
        //   enabled: false,
        //   title: "Pause",
        //   action: engine.getTransport().method('stop')
        // });
        // 
        // var actReset = hk.createAction({title: "Reset", action: function() {
        //   //
        // }});
        // 
        // toolbar.addAction(actStart);
        // toolbar.addAction(actPause);
        // toolbar.addAction(actReset);
        // 
        // function syncActionState() {
        //   if (engine.getTransport().isRunning()) {
        //     actStart.disable();
        //     actPause.enable();
        //   } else {
        //     actStart.enable();
        //     actPause.disable();
        //   }
        // }
        // 
        // engine.getTransport().runStateChanged.connect(syncActionState);
        // 
        // //
        // // Engine init
        // 
        // var env = {};
        // env.ctx = canvas.getContext();
        // env.canvas = env.ctx.canvas;
        // 
        // engine.setEnvironment(env);
        // 
        // 
        // 
        // engine.init(function(success) {
        //   if (!success) {
        //     alert('engine init failed!');
        //   } else {
        //     syncActionState();
        //   }
        // });
        // 
        // //
        // //
        
      }
    </script>
    
  </head>
  <body onload='init()'>
  </body>
</html>