"""Package only teaching sources. Run from the repository root."""
from pathlib import Path
import hashlib
import json
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

repo = Path(__file__).resolve().parents[1]
target = repo / "public/examples/checkpoints"

# Each download must install independently, even when no other checkpoint exists.
# Validate every lockfile before replacing any published archive.
for number in (6, 8, 11, 14):
    name = f"modul-{number:02}"
    source = repo / "examples/checkpoints" / name
    lock = json.loads((source / "package-lock.json").read_text())
    for location, package in lock["packages"].items():
        resolved = package.get("resolved", "")
        outside = location and (
            not location.startswith("node_modules/") or ".." in Path(location).parts
        )
        if outside or package.get("link") or (
            resolved and not resolved.startswith(("https://", "http://"))
        ):
            raise SystemExit(
                f"{name}: package-lock.json contains a local dependency at {location}. "
                "Regenerate the lockfile in a clean directory without node_modules."
            )

target.mkdir(parents=True, exist_ok=True)
excluded_dirs = {"node_modules", ".next", ".git", ".e2e", "test-results", "playwright-report"}
manifest = {}
for number in (6, 8, 11, 14):
    name = f"modul-{number:02}"
    source = repo / "examples/checkpoints" / name
    with ZipFile(target / f"{name}.zip", "w", compression=ZIP_DEFLATED) as archive:
        for path in sorted(source.rglob("*")):
            relative = path.relative_to(source)
            if path.is_symlink() or not path.is_file():
                continue
            if any(part in excluded_dirs for part in relative.parts):
                continue
            if (path.name.startswith(".env") and path.name != ".env.example") or ".db" in path.name or path.suffix == ".tsbuildinfo":
                continue
            info = ZipInfo(f"{name}/{relative.as_posix()}", date_time=(2026, 10, 11, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, path.read_bytes())
    manifest[f"{name}.zip"] = hashlib.sha256((target / f"{name}.zip").read_bytes()).hexdigest()
(target / "sha256.json").write_text(json.dumps(manifest, indent=2) + "\n")
print("Packaged 4 checkpoints (source, config, lockfiles, migrations, assets).")
