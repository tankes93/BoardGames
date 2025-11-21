function importNavbar(htmlName, displayName) {
    var navHTML = `
<style>	
	#navbar {
		position: sticky;
		top: 0;
		z-index: 900;
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.flex-navigation {
		color: white;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		background: linear-gradient(90deg, #0f3460 0%, #16213e 100%);
		width: 100%;
		margin: 0px;
		margin-bottom: 25px !important;
		justify-content: space-between;
		min-height: 60px;
		padding: 15px 30px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	}
	
	.sidemenu a,
	.flex-navigation a {
		font-size: 20px;
		margin: 10px 15px;
		text-decoration: none;
		color: #00d4ff;
		transition: all 0.3s ease;
		letter-spacing: 1px;
	}
	
	.sidemenu a:hover,
	.sidemenu a:active,
	.flex-navigation a:hover,
	.flex-navigation a:active {
		cursor: pointer;
		text-decoration: none;
		color: #00ffff;
		text-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
	}

	.sidemenu {
		position: fixed;
		top: 60px;
		left: -360px;
		width: 360px;
		height: calc(100vh - 60px);
		overflow-y: scroll;
		background: linear-gradient(180deg, #16213e 0%, #0f3460 100%);
		padding: 20px;
		display: flex;
		flex-direction: column;
		transition: left 0.4s ease;
		box-shadow: 5px 0 20px rgba(0, 0, 0, 0.5);
		border-right: 2px solid rgba(0, 212, 255, 0.3);
	}
	
	.sidemenu a { 
		font-size: 18px;
		padding: 12px;
		border-bottom: 1px solid rgba(0, 212, 255, 0.2);
	}
	
	.sidemenu a:hover {
		background: rgba(0, 212, 255, 0.1);
		border-left: 3px solid #00d4ff;
		padding-left: 15px;
	}
	
	#hamburger {
		font-size: 24px;
		color: #00d4ff;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	#hamburger:hover {
		color: #00ffff;
		transform: scale(1.1);
	}
</style>

<script>
	function toggleSideMenu() {
		var sidemenu = document.getElementById("sidemenu");
		if (sidemenu.style.left == "0px")
			sidemenu.style.left = "-360px";
		else
			sidemenu.style.left = "0px";
	}
</script>

<div class="flex-navigation hidden-xs">
	<div class="flex-center">
		<a href="../index.html"><i class="fa fa-gamepad"></i> Board Games</a>
		<i class="fa fa-angle-right" style="padding-top:2px; color: #00d4ff;"></i>
		<a href="${htmlName}.html">${displayName}</a>
	</div>
	
	<div class="flex-center">
		<a href="../index.html"><i class="fa fa-home"></i> Home</a>
	</div>
</div>

<div class="flex-navigation hidden-sm hidden-lg hidden-md">
	<div class="flex-center">
		<i id="hamburger" class="fa fa-bars" onclick="toggleSideMenu()"></i>
	</div>
	<div class="flex-center">
		<a href="${htmlName}.html">${displayName}</a>
	</div>
</div>

<div id="sidemenu" class="sidemenu hidden-sm hidden-lg hidden-md">
	<a href="../index.html"><i class="fa fa-home"></i> Home</a>
	<hr style="border-color: rgba(0, 212, 255, 0.3);"/>
	<a href="../Minesweeper/Minesweeper.html">Minesweeper</a>
	<a href="../SnakeNLadder/SnakeLadder.html">Snake & Ladder</a>
	<a href="../Connect4/Connect4.html">Connect 4</a>
	<a href="../Sudoku/Sudoku.html">Sudoku</a>
	<a href="../Ludo/Ludo.html">Ludo</a>
	<a href="../Tetris/Tetris.html">Tetris</a>
	<a href="../Snake/Snake.html">Snake</a>
</div>
`;

    $("#navbar").html(navHTML);
}
