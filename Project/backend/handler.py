from __future__ import annotations

from datetime import datetime
from typing import Any, Callable

from flask import request


def handle_null(function: Callable[[str], Any]):
    def _func(argument: str | None, default: Any = None):
        if argument is None:
            return default

        return function(argument)

    return _func


def request_get(arg: str):
    return request.args.get(arg, None)


@handle_null
def as_str(arg: str):
    return arg


@handle_null
def as_date(arg: str):
    return datetime.fromisoformat(arg)


@handle_null
def as_bool(arg: str):
    return bool(int(arg))


@handle_null
def as_int(arg: str):
    return int(arg)


@handle_null
def as_float(arg: str):
    return float(arg)


@handle_null
def as_list_of_str(arg: str):
    return request.args.getlist(arg)


@handle_null
def as_list_of_int(arg: str):
    string = as_list_of_str(arg)
    return list(map(int, string))
