# From https://gist.github.com/schlamar/2311116
import os
import sys
import traceback
from functools import wraps
from multiprocessing import Process, Pipe


def processify(func):
    '''Decorator to run a function as a process.
    Be sure that every argument and the return value
    is *pickable*.
    The created process is joined, so the code does not
    run in parallel.
    '''

    def process_func(pipe, *args, **kwargs):
        try:
            ret = func(*args, **kwargs)
        except Exception:
            ex_type, ex_value, tb = sys.exc_info()
            error = ex_type, ex_value, ''.join(traceback.format_tb(tb))
            ret = None
        else:
            error = None

        pipe.send((ret, error))

    # register original function with different name
    # in sys.modules so it is pickable
    process_func.__name__ = func.__name__ + 'processify_func'
    setattr(sys.modules[__name__], process_func.__name__, process_func)

    @wraps(func)
    def wrapper(*args, **kwargs):
        parent_conn, child_conn = Pipe()
        p = Process(target=process_func, args=[child_conn] + list(args), kwargs=kwargs)
        p.start()
        ret, error = parent_conn.recv()
        p.join()

        if error:
            ex_type, ex_value, tb_str = error
            message = '%s (in subprocess)\n%s' % (ex_value, tb_str)
            raise ex_type(message)

        return ret
    return wrapper


@processify
def test_function():
    return os.getpid()


@processify
def test_deadlock():
    return range(30000)


@processify
def test_exception():
    raise RuntimeError('xyz')
