import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from budget.etl import common, sample, taxonomy  # noqa: E402


@pytest.fixture(scope="session")
def tax():
    return taxonomy.read()


@pytest.fixture
def db(tmp_path, tax):
    con = common.create_db(tmp_path / "t.sqlite")
    taxonomy.load(con, tax)
    yield con
    con.close()


@pytest.fixture(scope="session")
def sample_raw(tmp_path_factory):
    d = tmp_path_factory.mktemp("raw")
    sample.write_all(d)
    return d
