// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

const Gio = imports.gi.Gio
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

function init() {
    overrideGio();
    overrideMainloop();

    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };
}

function key_exists (obj, key) {
    return obj.list_keys().indexOf(key) != -1;
}

function check_key_and_get (obj, method, key) {
    if (key_exists (obj, key)) {
        return method.call(obj, key);
    } else {
        log("GSettings key not found. schema: " + obj.schema + ", key: " + key);
        return null;
    }
}

function check_key_and_set (obj, method, key, val) {
    if (key_exists (obj, key)) {
        return method.call(obj, key, val);
    } else {
        log("GSettings key not found. schema: " + obj.schema + ", key: " + key);
        return false;
    }
}

function overrideGio() {
    Gio._real_get_value    = Gio.Settings.prototype.get_value;
    Gio._real_set_value    = Gio.Settings.prototype.set_value;
    Gio._real_get_boolean  = Gio.Settings.prototype.get_boolean;
    Gio._real_set_boolean  = Gio.Settings.prototype.set_boolean;
    Gio._real_get_int      = Gio.Settings.prototype.get_int;
    Gio._real_set_int      = Gio.Settings.prototype.set_int;
    Gio._real_get_uint     = Gio.Settings.prototype.get_uint;
    Gio._real_set_uint     = Gio.Settings.prototype.set_uint;
    Gio._real_get_double   = Gio.Settings.prototype.get_double;
    Gio._real_set_double   = Gio.Settings.prototype.set_double;
    Gio._real_get_string   = Gio.Settings.prototype.get_string;
    Gio._real_set_string   = Gio.Settings.prototype.set_string;
    Gio._real_get_strv     = Gio.Settings.prototype.get_strv;
    Gio._real_set_strv     = Gio.Settings.prototype.set_strv;
    Gio._real_get_enum     = Gio.Settings.prototype.get_enum;
    Gio._real_set_enum     = Gio.Settings.prototype.set_enum;
    Gio._real_get_flags    = Gio.Settings.prototype.get_flags;
    Gio._real_set_flags    = Gio.Settings.prototype.set_flags;

    Gio.Settings.prototype.get_value    = function(key)      { return check_key_and_get(this, Gio._real_get_value, key); }
    Gio.Settings.prototype.set_value    = function(key, val) { return check_key_and_set(this, Gio._real_set_value, key, val); }
    Gio.Settings.prototype.get_boolean  = function(key)      { return check_key_and_get(this, Gio._real_get_boolean, key); }
    Gio.Settings.prototype.set_boolean  = function(key, val) { return check_key_and_set(this, Gio._real_set_boolean, key, val); }
    Gio.Settings.prototype.get_int      = function(key)      { return check_key_and_get(this, Gio._real_get_int, key); }
    Gio.Settings.prototype.set_int      = function(key, val) { return check_key_and_set(this, Gio._real_set_int, key, val); }
    Gio.Settings.prototype.get_uint     = function(key)      { return check_key_and_get(this, Gio._real_get_uint, key); }
    Gio.Settings.prototype.set_uint     = function(key, val) { return check_key_and_set(this, Gio._real_set_uint, key, val); }
    Gio.Settings.prototype.get_double   = function(key)      { return check_key_and_get(this, Gio._real_get_double, key); }
    Gio.Settings.prototype.set_double   = function(key, val) { return check_key_and_set(this, Gio._real_set_double, key, val); }
    Gio.Settings.prototype.get_string   = function(key)      { return check_key_and_get(this, Gio._real_get_string, key); }
    Gio.Settings.prototype.set_string   = function(key, val) { return check_key_and_set(this, Gio._real_set_string, key, val); }
    Gio.Settings.prototype.get_strv     = function(key)      { return check_key_and_get(this, Gio._real_get_strv, key); }
    Gio.Settings.prototype.set_strv     = function(key, val) { return check_key_and_set(this, Gio._real_set_strv, key, val); }
    Gio.Settings.prototype.get_enum     = function(key)      { return check_key_and_get(this, Gio._real_get_enum, key); }
    Gio.Settings.prototype.set_enum     = function(key, val) { return check_key_and_set(this, Gio._real_set_enum, key, val); }
    Gio.Settings.prototype.get_flags    = function(key)      { return check_key_and_get(this, Gio._real_get_flags, key); }
    Gio.Settings.prototype.set_flags    = function(key, val) { return check_key_and_set(this, Gio._real_set_flags, key, val); }
}

function overrideMainloop() {
    Mainloop.__real_source_remove = Mainloop.source_remove;

    Mainloop.source_remove = function (id) {
        let dump = GLib.MainContext.default().find_source_by_id(id) == null;
        if (dump) {
            log("Invalid or null source id used when attempting to run Mainloop.source_remove()");
            global.dump_gjs_stack();
        }
        else {
            Mainloop.__real_source_remove(id);
        }
    }
}