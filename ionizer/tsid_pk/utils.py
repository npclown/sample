from tsidpy import TSID


def generate_tsid():
    return TSID.create().to_string("s")
