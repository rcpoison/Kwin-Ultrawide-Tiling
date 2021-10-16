var clients = workspace.clientList();
var activeClient;

for (var i=0; i<clients.length; i++) {
    if (clients[i].active) {
      activeClient = clients[i];
    }
}

workspace.clientActivated.connect(function(client){
  activeClient = client;
});

// function to check for valid clients taken from the tiling-kwin-script
// Copyright (C) 2012 Mathias Gottschlag <mgottschlag@gmail.com>
// Copyright (C) 2013-2014 Fabian Homborg <FHomborg@gmail.com>
var isIgnored = function(client) {
	// TODO: Add regex and more options (by title/caption, override a floater, maybe even a complete scripting language / code)
	// Application workarounds should be put here
	// HACK: Qt gives us a method-less QVariant(QStringList) if we ask for an array
	// Ask for a string instead (which can and should still be a StringList for the UI)
	var fl = "yakuake,krunner,plasma,plasma-desktop,plugin-container,Wine,klipper";
	// TODO: This could break if an entry contains whitespace or a comma - it needs to be validated on the qt side
	var floaters = String(readConfig("floaters", fl)).replace(/ /g,"").split(",");
	if (floaters.indexOf(client.resourceClass.toString()) > -1) {
		return true;
	}
	// HACK: Steam doesn't set the windowtype properly
	// Everything that isn't captioned "Steam" should be a dialog - these resize worse than the main window does
	// With the exception of course of the class-less update/start dialog with the caption "Steam" (*Sigh*)
	if (client.resourceClass.toString() == "steam" && client.caption != "Steam") {
		return true;
	} else if (client.resourceClass.toString() != "steam" && client.caption == "Steam") {
		return true;
	}
	return client.specialWindow 
		|| client.desktopWindow
		|| client.dock
		|| client.toolbar
		|| client.menu
		|| client.dialog
		|| client.splash
		|| client.utility
		|| client.dropdownMenu
		|| client.popupMenu
		|| client.tooltip
		|| client.notification
		|| client.comboBox
		|| client.dndIcon;
};

var resizeAndMove = function(size_dividend, size_multiple, pos_dividend, pos_index){
  print("Ultrawide tiling called to resize and move with args: " + size_dividend + ", " + size_multiple + ", " + pos_dividend + ", " + pos_index);
  if (isIgnored(activeClient)) {
    print("client ignored, not resizing or moving");
    return;
  }

  var workGeo = workspace.clientArea(KWin.PlacementArea, activeClient.screen, 1);
  var geo = activeClient.geometry;

  // vertical geometry should be top-to-bottom
  geo.y = workGeo.y;
  geo.height = workGeo.height;

  // horizontal position (from left edge)
  geo.x = (workGeo.width / pos_dividend) * pos_index;

  // width
  geo.width = (workGeo.width / size_dividend) * size_multiple;

  // HACK: unset "maximized" since kwin doesn't do it when you resize an already-maximized window with .geometry
  activeClient.setMaximize(false, false);

  print("new geometry is x: " + geo.x + " y: " + geo.y + " width: " + geo.width + " height: " + geo.height);
  activeClient.geometry = geo;
}

var maximize = function(){
  print("Ultrawide tiling called to maximize window");
  if (isIgnored(activeClient)) {
    print("client ignored, not maximizing");
    return;
  }
  activeClient.setMaximize(true, true);
}

print("Ultrawide tiling is active");

// fullscreen
registerShortcut("ULTRAWIDE TILING: Full", "ULTRAWIDE TILING: Full", "", function () {maximize()});

// halves
registerShortcut("ULTRAWIDE TILING: 1/2 Center", "ULTRAWIDE TILING: 1/2 Center", "", function () {resizeAndMove(2, 1, 4, 1)});
registerShortcut("ULTRAWIDE TILING: 1/2 Left", "ULTRAWIDE TILING: 1/2 Left", "", function () {resizeAndMove(2, 1, 2, 0)});
registerShortcut("ULTRAWIDE TILING: 1/2 Right", "ULTRAWIDE TILING: 1/2 Right", "", function () {resizeAndMove(2, 1, 2, 1)});

// thirds
registerShortcut("ULTRAWIDE TILING: 1/3 Left", "ULTRAWIDE TILING: 1/3 Left", "", function () {resizeAndMove(3, 1, 3, 0)});
registerShortcut("ULTRAWIDE TILING: 1/3 Center", "ULTRAWIDE TILING: 1/3 Center", "", function () {resizeAndMove(3, 1, 3, 1)});
registerShortcut("ULTRAWIDE TILING: 1/3 Right", "ULTRAWIDE TILING: 1/3 Right", "", function () {resizeAndMove(3, 1, 3, 2)});

// two-thirds
registerShortcut("ULTRAWIDE TILING: 2/3 Left", "ULTRAWIDE TILING: 2/3 Left", "", function () {resizeAndMove(3, 2, 6, 0)});
registerShortcut("ULTRAWIDE TILING: 2/3 Center", "ULTRAWIDE TILING: 2/3 Center", "", function () {resizeAndMove(3, 2, 6, 1)});
registerShortcut("ULTRAWIDE TILING: 2/3 Right", "ULTRAWIDE TILING: 2/3 Right", "", function () {resizeAndMove(3, 2, 6, 2)});

// quarters
registerShortcut("ULTRAWIDE TILING: 1/4 Left", "ULTRAWIDE TILING: 1/4 Left", "", function () {resizeAndMove(4, 1, 4, 0)});
registerShortcut("ULTRAWIDE TILING: 1/4 Left-Center", "ULTRAWIDE TILING: 1/4 Left-Center", "", function () {resizeAndMove(4, 1, 4, 1)});
registerShortcut("ULTRAWIDE TILING: 1/4 Right-Center", "ULTRAWIDE TILING: 1/4 Right-Center", "", function () {resizeAndMove(4, 1, 4, 2)});
registerShortcut("ULTRAWIDE TILING: 1/4 Right", "ULTRAWIDE TILING: 1/4 Right", "", function () {resizeAndMove(4, 1, 4, 3)});

// sixths
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Left", "ULTRAWIDE TILING: 1/6 Left-Left", "", function () {resizeAndMove(6, 1, 6, 0)});
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Center", "ULTRAWIDE TILING: 1/6 Left-Center", "", function () {resizeAndMove(6, 1, 6, 1)});
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Right", "ULTRAWIDE TILING: 1/6 Left-Right", "", function () {resizeAndMove(6, 1, 6, 2)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Left", "ULTRAWIDE TILING: 1/6 Right-Left", "", function () {resizeAndMove(6, 1, 6, 3)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Center", "ULTRAWIDE TILING: 1/6 Right-Center", "", function () {resizeAndMove(6, 1, 6, 4)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Right", "ULTRAWIDE TILING: 1/6 Right-Right", "", function () {resizeAndMove(6, 1, 6, 5)});
