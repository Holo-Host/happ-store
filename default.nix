{ pkgs ? import ./pkgs.nix {}, shell ? false }:

with pkgs;

let
  inherit (darwin.apple_sdk.frameworks) CoreServices Security;
in

{
  happ-store = buildDNA {
    inherit shell;

    name = "happ-store";
    src = gitignoreSource ./.;

    nativeBuildInputs = [
      zip
    ]
    ++ lib.optionals stdenv.isDarwin [ CoreServices ];
  };
}
