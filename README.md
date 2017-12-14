# JSMQ
JavaScript Media Queries

## Why
CSS Media queries are great but would be greater if there was javascript insight
into what size you're currently in. JSMQ allows you to define size definitions
for your own device breakdown that will work both by adding the correct classes
to the dom for the right sized devices and also trigger javascript events when
entering or exiting a device's defined size aspect.

## How
JSMQ can be implemented in a programmatic manner and also as an automated 
semantically defined manner.

### Programatic implementation

    const jsmq = new JSMQ();
    
    jsmq.setBreakpoint('mobile_breakpoint', 0, 320, 'device_mobile');
    jsmq.setBreakpoint('tablet_breakpoint', 321, 876, 'device_tablet');
    jsmq.setBreakpoint('desktop_breakpoint', 877, 1200, 'device_desktop');
    jsmq.setBreakpoint('large_breakpoint', 1200, '*', 'device_large_desktop');
    
    jsmq.on('tablet_breakpoint:enter', (payload) => {
        console.log('tablet_breakpoint entered',payload);
    });

### Semantic HTML implementation

    <html>
        <head></head>
        <body data-jsmq="0-320:device_mobile_small,321-480:device_mobile_large,481-768:device_tablet, 769-1200:device_screen, 1201-*:device_screen_large" >
            <div class="wrapper" data-jsmq="0-768:mobile,769-*:screen"></div> 
            <script>JSMQ.detect()</script>
        </body>
    </html>
