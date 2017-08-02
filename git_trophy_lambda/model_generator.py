import math
from datetime import date
from github_contributions import GithubUser
import tempfile
import os

try:
    import bpy
except ImportError:
    from bpy_lambda import bpy


BAR_COLORS = [
    (0.933, 0.933, 0.933),
    (0.776, 0.894, 0.545),
    (0.482, 0.788, 0.435),
    (0.137, 0.604, 0.231),
    (0.098, 0.380, 0.153)
]

FONT_COLOR = (0.141, 0.161, 0.18)

BASE_COLOR = (0.827, 0.827, 0.827)


def delete_all():
    '''Deletes all objects in a scene
    '''
    for obj in bpy.data.objects:
        bpy.data.objects.remove(obj, True)


def create_bar_materials():
    '''Creates materials for each of the BAR_COLORS
    '''
    return [create_material(c, str(idx)) for idx, c in enumerate(BAR_COLORS)]


def create_material(rgb, name):
    '''Creates a material with a given color (rgb) and name (name)
    '''
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgb
    return mat


def create_model_base(mat, num_weeks):
    '''Creates the rectangular solid

        num_weeks is used to make sure that the base is of the correct length
    '''
    width = num_weeks / 7.0
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
    base_obj = bpy.context.scene.objects.active
    base_obj.scale = (width, 1, 0.5)
    base_obj.location = (- width, 0, 0.5)
    base_obj.data.materials.append(mat)
    base_obj.data.materials[0] = mat


def create_user_label(mat, username, year):
    '''Create a label in the side of the model base to display the user and
        year
    '''
    bpy.ops.object.text_add(location=(0, 0, 0))
    text_ob = bpy.context.scene.objects.active
    text_ob.data.body = '{} / {}'.format(username, year)
    text_ob.data.align_x = 'LEFT'
    text_ob.data.materials.append(mat)

    text_ob.data.extrude = 0.075

    text_mesh = text_ob.to_mesh(bpy.context.scene, True, 'PREVIEW')
    text_mesh_ob = bpy.data.objects.new("text_mesh", text_mesh)
    text_mesh_ob.rotation_euler = [1.5709, 0, 3.14159]
    text_mesh_ob.location = (-2/7, 0.975, 0.25)
    bpy.context.scene.objects.link(text_mesh_ob)
    bpy.data.objects.remove(text_ob, True)


def coords_for_year_idx(idx):
    '''Translates a day-of-year index into an XY coordinate for a day bar
    '''
    x0 = -1/7
    y0 = -6/7
    week = math.floor(idx / 7)
    day = idx % 7
    x = x0 - week * (2.0/7)
    y = y0 + day * (2.0/7)
    return x, y


def create_day_bars(mats, counts, contributions, year):
    ''' Creates a colored day bar for each day in the contributions list

        Bar materials are taken from the 'mats' array
    '''

    max_count = max(counts)
    max_z = 0.75
    for idx, day in enumerate(contributions.days):
        if day.date < date(year, 1, 1) or day.count == 0:
            continue
        x, y = coords_for_year_idx(idx)
        z = (float(day.count) / max_count) * max_z

        bpy.ops.mesh.primitive_cube_add(location=(x, y, z + 1))
        day_obj = bpy.context.scene.objects.active
        day_obj.scale = (1.0/7, 1.0/7, z)
        day_obj.data.materials.append(mats[day.level])


def join_all_objects():
    ''' Joins all objects in the scene into a mesh
    '''
    obs = []
    for ob in bpy.context.scene.objects:
        if ob.type == 'MESH':
            ob.select = True
            print(ob.data.materials)
            bpy.context.scene.objects.active = ob
            obs.append(ob)
        else:
            ob.select = False

    bpy.ops.object.join()


def create_contribution_model(username, year):
    '''Creates a model representing the user's contributions for the given year.

        Returns the model as the string representation of an X3D file.

        :param str username: The Github username of the requesting user
        :param int year: The year of commits to be pulled

        :returns: A string representation of an X3D model
        :rtype: str
    '''

    contributions = GithubUser(username).contributions(
        end_date='{}-12-31'.format(year)
    )

    counts = [x.count for x in contributions.days]

    for scene in bpy.data.scenes:
        scene.render.engine = 'BLENDER_RENDER'

    delete_all()
    bar_mats = create_bar_materials()
    font_mat = create_material(FONT_COLOR, 'font')
    base_mat = create_material(BASE_COLOR, 'base')
    num_weeks = math.ceil(len(contributions.days) / 7)
    create_model_base(base_mat, num_weeks)
    create_user_label(font_mat, username, year)
    create_day_bars(bar_mats, counts, contributions, year)
    join_all_objects()


def get_model_data(username, year):
    create_contribution_model(username, year)

    # Get a temp file for saving the x3d data
    fd, file_path = tempfile.mkstemp(suffix='.x3d')
    os.close(fd)

    # Save scene as x3d
    bpy.ops.export_scene.x3d(filepath=file_path)

    # Read back x3d data
    with open(file_path, 'rb') as f:
        x3d_data = f.read()

    # Remove temp file
    os.remove(file_path)

    return x3d_data
