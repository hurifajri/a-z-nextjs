"""Run with: python3 scripts/test-checkpoint-packaging.py"""
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from zipfile import ZipFile


class CheckpointPackagingTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "scripts").mkdir()
        self.script = self.root / "scripts/package-checkpoints.py"
        shutil.copy2(Path(__file__).with_name("package-checkpoints.py"), self.script)
        for number in (6, 8, 11, 14):
            folder = self.root / f"examples/checkpoints/modul-{number:02}"
            folder.mkdir(parents=True)
            package = {"name": f"modul-{number:02}", "dependencies": {"next": "16.3.7"}}
            lock = {"lockfileVersion": 3, "packages": {
                "": package,
                "node_modules/next": {
                    "version": "16.3.7",
                    "resolved": "https://registry.npmjs.org/next/-/next-16.3.7.tgz",
                },
            }}
            (folder / "package.json").write_text(json.dumps(package))
            (folder / "package-lock.json").write_text(json.dumps(lock))

    def run_packager(self):
        return subprocess.run([sys.executable, str(self.script)], capture_output=True, text=True)

    def test_registry_dependencies_are_packaged(self):
        result = self.run_packager()
        self.assertEqual(result.returncode, 0, result.stderr)
        archives = list((self.root / "public/examples/checkpoints").glob("*.zip"))
        self.assertEqual(len(archives), 4)
        with ZipFile(archives[0]) as archive:
            self.assertTrue(any(name.endswith("/package-lock.json") for name in archive.namelist()))

    def test_cross_checkpoint_link_is_rejected_before_any_zip_is_written(self):
        file = self.root / "examples/checkpoints/modul-08/package-lock.json"
        lock = json.loads(file.read_text())
        lock["packages"]["node_modules/next"] = {
            "resolved": "../modul-14/node_modules/next", "link": True,
        }
        file.write_text(json.dumps(lock))
        result = self.run_packager()
        self.assertNotEqual(result.returncode, 0, "A checkpoint with a local dependency link was published")
        self.assertIn("modul-08", result.stderr)
        self.assertFalse(list((self.root / "public/examples/checkpoints").glob("*.zip")))


if __name__ == "__main__":
    unittest.main()
