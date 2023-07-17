{ pkgs }: {
	deps = [
	pkgs.python39Full
    pkgs.poetry
    pkgs.ffmpeg.bin
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}